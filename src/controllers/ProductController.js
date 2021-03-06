const { Product } = require('../models/product')
const { Category } = require('../models/category')
const mongoose = require('mongoose')

module.exports = {
    /**
     * Récupération de tous les produits
     * @see http://localhost:3000/api/v1/products
     */
    async getAllProducts(req, res) {
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
        } else {
            return res.send(productList)
        }
    },

    /**
     * Récupération d'un produit grâce à son ID
     * @param id identifiant du product à récupérer
     * @return Product
     */
    async getProductById(req, res) {
        const product = await Product.findById(req.params.id).populate(
            'category'
        )

        if (!product) {
            res.status(500).json({
                success: false,
            })
        } else {
            res.send(product)
        }
    },

    /**
     * Création d'un produit dans la collection Product
     * @method findById()
     * @method single(fieldNameModel)
     * @see http://localhost:3000/api/v1/products
     */
    async createProduct(req, res) {
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

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: file.location,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            isFeatured: req.body.isFeatured,
        })

        product = await product.save()

        if (!product) {
            return res.status(500).send('The product cannot be craeted')
        } else {
            res.send(product)
        }
    },

    /**
     * Mettre à jour un produit via son ID
     * @method findByIdAndUpdate()
     * @method isValidObjectId()
     * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
     */
    async updateProductById(req, res) {
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
            imagePath = file.location
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
        } else {
            res.send(updatedProduct)
        }
    },

    /**
     * Suppression d'un produit via son ID
     * @see http://localhost:3000/api/v1/products/:id
     * @param id identifiant du product à supprimer
     */
    async deleteProductById(req, res) {
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
    },

    /**
     * Methode qui permet de calculer le nombre des Products dans la collections Products
     * @method countDocuments()
     * @see http://localhost:3000/api/v1/products/get/count
     */
    async getCountAllProduct(req, res) {
        const productCount = await Product.countDocuments((count) => count)

        if (productCount === 0) {
            return res.status(200).json({
                productCount: 0,
            })
        } else if (!productCount) {
            return res.status(500).json({
                success: false,
            })
        } else {
            res.send({
                productCount: productCount,
            })
        }
    },

    /**
     * Methode qui permet de connaître le nombre total des produits restant via son ID
     * @param {*} req
     * @param {*} res
     * @see http://localhost:3000/api/v1/products/get/count/[:id]
     */
    async getCountProduct(req, res) {
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
    },

    /**
     * Récuperer tous les produits ayant le champ "Featured" à true
     * @method find()
     * @see http://localhost:3000/api/v1/products/get/featured/[:count]
     *
     * Récupérer un nombre fixe des produits featured, le nombre passé en paramètre
     * @see +count : caster le type de la variable en Number (Raison du +)
     * @see $gte : au moins (minimum value)
     */
    async getAllFeaturedProduct(req, res) {
        const count = req.params.count ? req.params.count : 0
        const products = await Product.find({
            isFeatured: true,
            countInStock: { $gte: 1 },
        }).limit(+count)

        if (!products) {
            return res.status(500).json({
                success: false,
            })
        } else {
            res.send(products)
        }
    },

    /**
     * Mettre à jour le tableau d'image pour un produit
     * @see req.files accès au tableau
     * @see file.filename le nom du fichier
     * @method array ('fieldName', maxNumberImages)
     */
    async updateImagesProductById(req, res) {
        mongoose.set('useFindAndModify', false)
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product ID')
        }

        const files = req.files
        let imagesPaths = []

        if (files) {
            files.map((file) => {
                imagesPaths.push(file.location)
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
    },
}
