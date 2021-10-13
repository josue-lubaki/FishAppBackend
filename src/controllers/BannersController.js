const { Product } = require('../models/product')
const { Banner } = require('../models/banner')
const mongoose = require('mongoose')

module.exports = {
    async getAllBanners(req, res) {
        try {
            const BannerList = await Banner.find().catch((err) =>
                console.log(err)
            )

            if (!BannerList) {
                res.status(500).json({
                    success: false,
                })
            } else if (BannerList.length == 0) {
                res.status(400).json({
                    success: false,
                    message: 'La collection banner est vide',
                })
            }
            res.status(200).send(BannerList)
        } catch (error) {
            throw new Error(`Error while getting All Banners : ${error}`)
        }
    },

    async getBannerById(req, res) {
        try {
            const banner = await Banner.findById(req.params.id)

            if (!banner) {
                res.status(500).json({
                    success: false,
                })
            }
            res.send(banner)
        } catch (error) {
            throw Error(`Error while getting Banner by Id : ${error}`)
        }
    },

    async createBanner(req, res) {
        try {
            // Vérifier si l'image existe dans la requête
            /*
                fieldname: 'image',
                originalname: 'poisson-glace.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                size: 2344967,
                bucket: 'fish-bucket-images',
                key: 'poisson-glace.jpg-1634108886181.jpg',
                acl: 'private',
                contentType: 'application/octet-stream',
                contentDisposition: null,
                storageClass: 'STANDARD',
                serverSideEncryption: null,
                metadata: { fieldName: 'image' },
                location: 'https://fish-bucket-images.s3.amazonaws.com/poisson-glace.jpg-1634108886181.jpg',
                etag: '"a450c99f52ad469a35a771918be04c77"',
                versionId: undefined
             */
            const file = req.file
            if (!file) {
                return res.status(400).send('No Image in the request')
            }

            let banner = new Banner({
                name: req.body.name,
                image: file.location,
            })

            banner = await banner.save()

            if (!banner) {
                return res.status(500).send('The banner cannot be created')
            }

            res.send(banner)
        } catch (error) {
            throw Error(`Error while creating a banner : ${error}`)
        }
    },

    async deleteBannerById(req, res) {
        try {
            Banner.findByIdAndDelete(req.params.id)
                .then((image) => {
                    if (image) {
                        return res.status(200).json({
                            success: true,
                            message: 'The image is deleted',
                        })
                    } else {
                        return res.status(404).json({
                            success: false,
                            message: 'image not found !',
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
            throw new Error(`Error while deleting a banner Image : ${error}`)
        }
    },
}
