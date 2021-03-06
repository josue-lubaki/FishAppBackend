const mongoose = require('mongoose')

// Le Schema du model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    avenue: {
        type: String,
        default: '',
    },
    apartment: {
        type: String,
        default: '',
    },
    quartier: {
        type: String,
        default: '',
    },
    commune: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: 'Kinshasa',
    },
    country: {
        type: String,
        default: 'RDC',
    },
    question: {
        type: String,
    },
    reponse: {
        type: String,
    },
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true,
})

exports.User = mongoose.model('User', userSchema)
