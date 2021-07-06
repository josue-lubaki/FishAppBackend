const { Product } = require('../models/product')
const { Category } = require('../models/category')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const ProductController = require('../controllers/ProductController')

// contient les extensions dont nous souhaitons supportées
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValidFile = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')

        if (isValidFile) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    },
})

const uploadOptions = multer({ storage: storage })

/**
 * Récupération de tous les produits
 * @see http://localhost:3000/api/v1/products
 */
router.get(`/`, ProductController.getAllProducts)

/**
 * Récupération d'un produit grâce à son ID
 * @param id identifiant du product à récupérer
 * @see http://localhost:3000/api/v1/products/:id
 * @return Product
 */
router.get('/:id', ProductController.getProductById)

/**
 * Création d'un produit dans la collection Product
 * @method findById()
 * @method single(fieldNameModel)
 * @see http://localhost:3000/api/v1/products
 */
router.post(`/`, uploadOptions.single('image'), ProductController.createProduct)

/**
 * Mettre à jour un produit via son ID
 * @method findByIdAndUpdate()
 * @method isValidObjectId()
 * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
 */
router.put(
    '/:id',
    uploadOptions.single('image'),
    ProductController.updateProductById
)

/**
 * Suppression d'un produit via son ID
 * @see http://localhost:3000/api/v1/products/:id
 * @param id identifiant du product à supprimer
 */
router.delete(`/:id`, ProductController.deleteProductById)

/**
 * Methode qui permet de calculer le nombre des Products dans la collections Products
 * @method countDocuments()
 * @see http://localhost:3000/api/v1/products/get/count
 */
router.get('/get/count', ProductController.getCountAllProduct)

/**
 * Récuperer tous les produits ayant le champ "Featured" à true
 * @method find()
 * @see http://localhost:3000/api/v1/products/get/featured/[:count]
 *
 * Récupérer un nombre fixe des produits featured, le nombre passé en paramètre
 * @see +count : caster le type de la variable en Number (Raison du +)
 */
router.get('/get/featured/:count', ProductController.getAllFeaturedProduct)

/**
 * Mettre à jour le tableau d'image pour un produit
 * @see req.files accès au tableau
 * @see file.filename le nom du fichier
 * @method array ('fieldName', maxNumberImages)
 */
router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    ProductController.updateImagesProductById
)

module.exports = router
