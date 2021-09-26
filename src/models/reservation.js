const mongoose = require('mongoose')

// Le Schema du model
const reservationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
            required: true,
        },
    ],
    status: {
        type: String,
        required: true,
        default: '1',
    },
    notes: {
        type: String,
    },
    totalPrice: {
        type: Number,
    },
    dateReservated: {
        type: Date,
        default: Date.now,
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
})

reservationSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

reservationSchema.set('toJSON', { virtuals: true })

exports.Reservation = mongoose.model('Reservation', reservationSchema)
