const express = require('express')
const router = express.Router()
const BannerController = require('../controllers/BannersController')
const uploadOptions = require('../../helpers/s3Upload')
const asyncWrapper = require('../../helpers/middleware/asyncWrapper')

/**
 * Récupération de toutes les images
 * @see http://localhost:3000/api/v1/banners
 * @return { Banner || success : "value" || success : "value", message : "value" }
 */
router.get(`/`, asyncWrapper(BannerController.getAllBanners))

/**
 * Récupération d'une image Banner grâce à son ID
 * @param id identifiant de l'image à récupérer
 * @see http://localhost:3000/api/v1/banners/:id
 * @return { Banner || success : "value" || success : "value", message : "value" }
 */
router.get('/:id', asyncWrapper(BannerController.getBannerById))

/**
 * Création d'une image dans la collection Banner
 * @method findById()
 * @method single(fieldNameModel)
 * @see http://localhost:3000/api/v1/banners
 * @return { Banner }
 */
router.post(
    `/`,
    asyncWrapper(uploadOptions.single('image'), BannerController.createBanner)
)

/**
 * Suppression d'une image Banner via son ID
 * @see http://localhost:3000/api/v1/banners/:id
 * @param id identifiant de l'image banner à supprimer
 * @return { success : "value", message : "value"}
 */
router.delete(`/:id`, asyncWrapper(BannerController.deleteBannerById))

module.exports = router
