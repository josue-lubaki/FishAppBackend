const { Banner } = require('../models/banner')

module.exports = {
    async getAllBanners(req, res) {
        const BannerList = await Banner.find().catch((err) => console.log(err))

        if (!BannerList) {
            res.status(500).json({
                success: false,
            })
        } else if (BannerList.length == 0) {
            res.status(400).json({
                success: false,
                message: 'La collection banner est vide',
            })
        } else {
            res.status(200).send(BannerList)
        }
    },

    async getBannerById(req, res) {
        const banner = await Banner.findById(req.params.id)

        if (!banner) {
            res.status(500).json({
                success: false,
            })
        } else {
            res.send(banner)
        }
    },

    async createBanner(req, res) {
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
        } else {
            res.send(banner)
        }
    },

    async deleteBannerById(req, res) {
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
    },
}
