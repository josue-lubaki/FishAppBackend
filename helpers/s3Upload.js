const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

module.exports = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'fish-bucket-images',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        key: function (req, file, cb) {
            const ext = path.extname(file.originalname)
            const name = path.basename(file.originalname)

            cb(null, `${name.replace(/\s/g, '')}-${Date.now()}${ext}`)
        },
    }),
})
