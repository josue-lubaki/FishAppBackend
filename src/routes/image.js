const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

router.get('/:url', function (req, res) {
    console.log('Voici le req : ' + req)
    console.log('Voici le req.params : ' + req.params)
    console.log('Voici le req.params.url : ' + req.params.url)
    const url = req.params.url

    if (!url) {
        res.status(500).json({
            success: "On n'a pas l'image",
        })
    } else {
        res.status(200).send(url)
    }
})

module.exports = router
