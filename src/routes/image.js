const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

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

// const readFile = (file) => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader()
//         reader.onload = () => {
//             resolve(reader.result)
//         }
//         reader.onerror = reject
//         reader.readAsDataURL(file)
//     })
// }

// const upload = async () => {
//     // ... the code from the previous part
//     const response = await fetch(
//         `${document.location.origin}/.netlify/functions/upload`,
//         {
//             method: 'POST',
//             body: file,
//         }
//     )
//     const data = await response.json()
// }

router.get('/:url', uploadOptions.single('image'), function (req, res) {
    console.log('Voici le req : ' + req)
    console.log('Voici le req.params : ' + req.params)
    console.log('Voici le req.params.url : ' + req.params.url)
    const url = req.params.url
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    if (!url) {
        res.status(500).json({
            success: "On n'a pas l'image",
        })
    } else {
        res.status(200).send(`<img src='${basePath}${url}'>`)
    }
})

module.exports = router
module.exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: 'RETURN MESSAGE',
    }
}
