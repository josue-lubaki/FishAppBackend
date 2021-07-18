const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
})

exports.Banner = mongoose.model('Banner', bannerSchema)
