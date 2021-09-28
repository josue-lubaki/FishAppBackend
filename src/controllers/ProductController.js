const { Product } = require('../models/product')
const { Category } = require('../models/category')
const mongoose = require('mongoose')

module.exports = {
    /**
     * Récupération de tous les produits
     * @see http://localhost:3000/api/v1/products
     */
    async getAllProducts(req, res) {
        try {
            let filter = {}
            if (req.query.categories) {
                filter = { category: req.query.categories.split(',') }
            }

            const productList = await Product.find(filter)
                .populate('category')
                .catch((err) => console.log(err))

            if (!productList) {
                return res.status(500).json({
                    success: 'Oups ! La liste est vide',
                })
            }
            return res.send(productList)
        } catch (error) {
            throw Error(`Error while getting All Products : ${error}`)
        }
    },

    /**
     * Récupération d'un produit grâce à son ID
     * @param id identifiant du product à récupérer
     * @return Product
     */
    async getProductById(req, res) {
        try {
            const product = await Product.findById(req.params.id).populate(
                'category'
            )

            if (!product) {
                res.status(500).json({
                    success: false,
                })
            }
            res.send(product)
        } catch (error) {
            throw Error(`Error while getting product by Id : ${error}`)
        }
    },

    /**
     * Création d'un produit dans la collection Product
     * @method findById()
     * @method single(fieldNameModel)
     * @see http://localhost:3000/api/v1/products
     */
    async createProduct(req, res) {
        try {
            // Vérifier l'existence de la catgorie avant de créer un produit
            const category = await Category.findById(req.body.category)
            if (!category) {
                return res.status(400).send('invalid Category')
            }

            // Vérifier si l'image existe dans la requête
            const file = req.file
            if (!file) {
                return res.status(400).send('No Image in the request')
            }

            const fileName = req.file.filename
            // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
            const basePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/`

            let product = new Product({
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: `${basePath}${fileName}` || '', // http://localhost:3000/public/uploads/image-2323232.jpeg
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                isFeatured: req.body.isFeatured,
            })

            product = await product.save()

            if (!product) {
                return res.status(500).send('The product cannot be craeted')
            }

            res.send(product)
        } catch (error) {
            throw Error(`Error while creating a product : ${error}`)
        }
    },

    /**
     * Mettre à jour un produit via son ID
     * @method findByIdAndUpdate()
     * @method isValidObjectId()
     * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
     */
    async updateProductById(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).send('Invalid Produit Id')
            }

            // Vérifier l'existence de la catgorie avant de mettre à jour un produit
            const category = await Category.findById(req.body.category)
            if (!category) {
                return res.status(400).send('invalid Category')
            }

            // Vérifier si le produit existe
            const product = await Product.findById(req.params.id)
            if (!product) {
                return res.status(400).send('Invalid Product')
            }

            // Si L'Utilisateur désire changer l'image
            const file = req.file
            let imagePath

            if (file) {
                const basePath = `${req.protocol}://${req.get(
                    'host'
                )}/public/uploads/`
                const fileName = file.filename
                imagePath = `${basePath}${fileName}`
            } else {
                imagePath = product.image
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    description: req.body.description,
                    richDescription: req.body.richDescription,
                    image: imagePath,
                    brand: req.body.brand,
                    price: req.body.price,
                    category: req.body.category,
                    countInStock: req.body.countInStock,
                    rating: req.body.rating,
                    numReviews: req.body.numReviews,
                    isFeatured: req.body.isFeatured,
                },
                { new: true }
            )

            if (!updatedProduct) {
                return res.status(500).send('the product cannot be updated')
            }

            res.send(updatedProduct)
        } catch (error) {
            throw Error(`Error while updating product by Id : ${error}`)
        }
    },

    /**
     * Suppression d'un produit via son ID
     * @see http://localhost:3000/api/v1/products/:id
     * @param id identifiant du product à supprimer
     */
    async deleteProductById(req, res) {
        try {
            Product.findByIdAndDelete(req.params.id)
                .then((product) => {
                    if (product)
                        return res.status(200).json({
                            success: true,
                            message: 'The product is deleted',
                        })
                    else {
                        return res.status(404).json({
                            success: false,
                            message: 'product not found !',
                        })
                    }
                })
                .catch((err) => {
                    return res.status(400).json({
                        success: false,
                        error: err,
                    })
                })
        } catch (error) {
            throw Error(`Error while deleting a product by ID : ${error}`)
        }
    },

    /**
     * Methode qui permet de calculer le nombre des Products dans la collections Products
     * @method countDocuments()
     * @see http://localhost:3000/api/v1/products/get/count
     */
    async getCountAllProduct(req, res) {
        try {
            const productCount = await Product.countDocuments((count) => count)

            if (productCount === 0) {
                return res.status(200).json({
                    productCount: 0,
                })
            } else if (!productCount) {
                return res.status(500).json({
                    success: false,
                })
            }

            res.send({
                productCount: productCount,
            })
        } catch (error) {
            throw Error(
                `Error while getting Toatal Count of Product : ${error}`
            )
        }
    },
    
    /**
     * Methode qui permet de connaître le nombre total des produits restant via son ID
     * @param {*} req
     * @param {*} res
     * @see http://localhost:3000/api/v1/products/get/count/[:id]
     */
    async getCountProduct(req, res) {
        try {
            // Récupérer l'ID du produit
            const product = await Product.findById(req.params.id)

            if (!product) {
                return res.status(500).json({
                    success: false,
                })
            } else if (product.countInStock === 0) {
                return res.status(200).json({
                    success: true,
                    countInStock: 0,
                })
            } else {
                return res.status(200).json({
                    success: true,
                    countInStock: product.countInStock,
                })
            }
        } catch (error) {
            throw Error(`Error while getting count a product by ID : ${error}`)
        }
    },

    /**
     * Récuperer tous les produits ayant le champ "Featured" à true
     * @method find()
     * @see http://localhost:3000/api/v1/products/get/featured/[:count]
     *
     * Récupérer un nombre fixe des produits featured, le nombre passé en paramètre
     * @see +count : caster le type de la variable en Number (Raison du +)
     */
    async getAllFeaturedProduct(req, res) {
        try {
            const count = req.params.count ? req.params.count : 0
            const products = await Product.find({ isFeatured: true }).limit(
                +count
            )

            if (!products) {
                return res.status(500).json({
                    success: false,
                })
            }
            res.send(products)
        } catch (error) {
            throw Error(`Error while getting All Featured product : ${error}`)
        }
    },

    /**
     * Mettre à jour le tableau d'image pour un produit
     * @see req.files accès au tableau
     * @see file.filename le nom du fichier
     * @method array ('fieldName', maxNumberImages)
     */
    async updateImagesProductById(req, res) {
        try {
            mongoose.set('useFindAndModify', false)
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).send('Invalid Product ID')
            }

            const files = req.files
            let imagesPaths = []
            const basePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/`

            if (files) {
                files.map((file) => {
                    imagesPaths.push(`${basePath}${file.filename}`)
                })
            }

            const product = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    images: imagesPaths,
                },
                { new: true }
            )

            if (!product) {
                return res.status(500).send('the product cannot be updated')
            }

            res.send(product)
        } catch (error) {
            throw Error(`Error while updating Images product by Id : ${error}`)
        }
    },
}
