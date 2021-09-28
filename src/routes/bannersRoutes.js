const express = require('express')
const router = express.Router()
const multer = require('multer')
const BannerController = require('../controllers/BannersController')

const Storage = require('../../helpers/storage')
const uploadOptions = multer({ storage: Storage })

/**
 * Récupération de toutes les images
 * @see http://localhost:3000/api/v1/banners
 * @return { Banner || success : "value" || success : "value", message : "value" }
 */
router.get(`/`, BannerController.getAllBanners)

/**
 * Récupération d'une image Banner grâce à son ID
 * @param id identifiant de l'image à récupérer
 * @see http://localhost:3000/api/v1/banners/:id
 * @return { Banner || success : "value" || success : "value", message : "value" }
 */
router.get('/:id', BannerController.getBannerById)

/**
 * Création d'une image dans la collection Banner
 * @method findById()
 * @method single(fieldNameModel)
 * @see http://localhost:3000/api/v1/banners
 * @return { Banner }
 */
router.post(`/`, uploadOptions.single('image'), BannerController.createBanner)

/**
 * Suppression d'une image Banner via son ID
 * @see http://localhost:3000/api/v1/banners/:id
 * @param id identifiant de l'image banner à supprimer
 * @return { success : "value", message : "value"}
 */
router.delete(`/:id`, BannerController.deleteBannerById)

module.exports = router
