const express = require('express')
const router = express.Router()
const CategorieController = require('../controllers/CategorieController')
const asyncWrapper = require('../../helpers/middleware/asyncWrapper')

/**
 * Récuperation des caterogies contenues dans la collection Categories
 * @method find()
 * @method send()
 * @see /api/v1/categories
 * @return {Category || success : "value"}
 */
router.get(`/`, asyncWrapper(CategorieController.getAllCategories))

/**
 * Récupérer une category à partir de son ID
 * @method findById()
 * @see /api/v1/categories/:id
 * @return {Category || success : "value"}
 */
router.get(`/:id`, asyncWrapper(CategorieController.getCategorieById))

/**
 * Création d'une nouvelle Category dans la collection catégories
 * @method save()
 * @method send()
 * @see /api/v1/categories
 * @return { Category }
 */
router.post('/', asyncWrapper(CategorieController.createCategorie))

/**
 * Suppression d'une category dans la collection Categories
 * @method findByIdAndDelete()
 * @see /api/v1/categories/:id
 * @return {success : "value", message : "value"}
 */
router.delete('/:id', asyncWrapper(CategorieController.deleteCategorieById))

/**
 * La Mise à jour d'un enregistrement via son ID
 * @method findByIdAndUpdate()
 * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
 * @return { category }
 */
router.put('/:id', asyncWrapper(CategorieController.updateCategorieById))

/**
 * Methode qui permet de calculer le nombre des Products dans la collections Products
 * @method countDocuments()
 * @see http://localhost:3000/api/v1/categories/get/count
 * @return { orderCount: "value" || success : "value" }
 */
router.get('/get/count', asyncWrapper(CategorieController.getCountCategories))

module.exports = router
