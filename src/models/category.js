const mongoose = require('mongoose')

// Le Schema du model
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
    },
})

categorySchema.virtual('id').get(function () {
    return this._id.toHexString()
})

categorySchema.set('toJSON', { virtuals: true })

exports.Category = mongoose.model('Category', categorySchema)
