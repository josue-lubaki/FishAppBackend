const express = require('express')
const router = express.Router()
const multer = require('multer')
const ProductController = require('../controllers/ProductController')
const uploadOptions = require('../../helpers/s3Upload')
const asyncWrapper = require('../../helpers/middleware/asyncWrapper')

/**
 * Récupération de tous les produits
 * @see http://localhost:3000/api/v1/products
 * @return {Product}
 */
router.get(`/`, asyncWrapper(ProductController.getAllProducts))

/**
 * Récupération d'un produit grâce à son ID
 * @param id identifiant du product à récupérer
 * @see http://localhost:3000/api/v1/products/:id
 * @return {Product}
 */
router.get('/:id', asyncWrapper(ProductController.getProductById))

/**
 * Création d'un produit dans la collection Product
 * @method findById()
 * @method single(fieldNameModel)
 * @see http://localhost:3000/api/v1/products
 * @return {Product}
 */
router.post(
    `/`,
    uploadOptions.single('image'),
    asyncWrapper(ProductController.createProduct)
)

/**
 * Mettre à jour un produit via son ID
 * @method findByIdAndUpdate()
 * @method isValidObjectId()
 * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
 * @return {Product}
 */
router.put(
    '/:id',
    uploadOptions.single('image'),
    asyncWrapper(ProductController.updateProductById)
)

/**
 * Suppression d'un produit via son ID
 * @see http://localhost:3000/api/v1/products/:id
 * @param id identifiant du product à supprimer
 * @return {success: "value", message: "value"}
 */
router.delete(`/:id`, asyncWrapper(ProductController.deleteProductById))

/**
 * Methode qui permet de calculer le nombre des Products dans la collections Products
 * @method countDocuments()
 * @see http://localhost:3000/api/v1/products/get/count
 * @return {productCount: "value"}
 */
router.get('/get/count', asyncWrapper(ProductController.getCountAllProduct))

/**
 * methode qui permet de calculer le nombre des Products dans la collections Product via son ID
 * @see http://localhost:3000/api/v1/products/get/count/:id
 * @return {success : "value", countInStock : "value"}
 */
router.get('/get/count/:id', asyncWrapper(ProductController.getCountProduct))

/**
 * Récuperer tous les produits ayant le champ "Featured" à true
 * @method find()
 * @see http://localhost:3000/api/v1/products/get/featured/[:count]
 * @return {Product || success: "value"}
 *
 * Récupérer un nombre fixe des produits featured, le nombre passé en paramètre
 * @see +count : caster le type de la variable en Number (Raison du +)
 */
router.get(
    '/get/featured/:count',
    asyncWrapper(ProductController.getAllFeaturedProduct)
)

/**
 * Mettre à jour le tableau d'image pour un produit
 * @see req.files accès au tableau
 * @see file.filename le nom du fichier
 * @method array ('fieldName', maxNumberImages)
 * @return { Product }
 */
router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 3),
    asyncWrapper(ProductController.updateImagesProductById)
)

module.exports = router
