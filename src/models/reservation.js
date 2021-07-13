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
    note: {
        type: String,
    },
    totalPrice: {
        type: Number,
    },
    dateReservated: {
        type: Date,
        default: Date.now,
    },
})

reservationSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

reservationSchema.set('toJSON', { virtuals: true })

exports.Reservation = mongoose.model('Reservation', reservationSchema)
