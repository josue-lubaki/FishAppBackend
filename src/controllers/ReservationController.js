const { Reservation } = require('../models/reservation')
const { OrderItem } = require('../models/order-item')
const { User } = require('../models/user')
const mongoose = require('mongoose')

module.exports = {
    /**
     * Récupération de tous les reservation
     * @see http://localhost:3000/api/v1/reservations
     */
    async getAllReservations(req, res) {
        try {
            let filter = {}
            if (req.query.status) {
                filter = { status: req.query.status.split(',') }
            }

            const reservationList = await Reservation.find(filter)
                .populate('user', '-passwordHash')
                .populate({
                    path: 'orderItems',
                    populate: {
                        path: 'product',
                        populate: { path: 'category', select: 'name' },
                    },
                })
                .catch((err) => console.log(err))

            if (!reservationList) {
                return res.status(500).json({
                    success: 'Oups ! La liste de reservation est vide',
                })
            }
            return res.send(reservationList)
        } catch (error) {
            throw Error(`Error while getting All reservations : ${error}`)
        }
    },

    /**
     * Récupération d'une reservation grâce à son ID
     * @param id identifiant de la Reservation à récupérer
     * @see http://localhost:3000/api/v1/Reservations/:id
     * @return Reservation
     */
    async getReservationById(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id)
                .populate('user', '-passwordHash')
                .populate({
                    path: 'orderItems',
                    populate: {
                        path: 'product',
                        populate: { path: 'category' },
                    },
                })

            if (!reservation) {
                return res.status(500).json({
                    success: false,
                })
            }
            res.send(reservation)
        } catch (error) {
            throw Error(`Error while getting a reservation : ${error}`)
        }
    },

    /**
     * Création d'une reservation dans la collection Reservation
     * @method findById()
     * @method single(fieldNameModel)
     * @see http://localhost:3000/api/v1/Reservations
     */
    async createReservation(req, res) {
        try {
            // Vérifier l'existence de l'utilisateur avant de créer une reservation
            const user = await User.findById(req.body.user)
            if (!user) {
                return res
                    .status(400)
                    .send('invalid reservation : User no found')
            }

            if (!req.body.orderItems) {
                return res.status(400).json({
                    message:
                        'Invalid Reservation : La reservation ne contient aucun article',
                })
            }

            // Vérifier si le panier contient au moins un article
            const orderItemIds = await Promise.all(
                req.body.orderItems.map(async (orderItem) => {
                    if (orderItem) {
                        let newOrderItem = new OrderItem({
                            quantity: orderItem.quantity,
                            product: orderItem.product,
                        })

                        newOrderItem = await newOrderItem.save()
                        return newOrderItem._id
                    }
                })
            ).catch((err) => console.log(err))

            // Calcul de la somme des OrderItems choisis
            // @return Number[]
            const totalPrices = await Promise.all(
                orderItemIds.map(async (orderItemId) => {
                    const orderItem = await OrderItem.findById(
                        orderItemId
                    ).populate('product', 'price')

                    return orderItem.product.price * orderItem.quantity
                })
            ).catch((err) => console.log(err))

            /**
             * @method reduce (CallbackFunction, initialValue) : fonction d'accumulation
             * calcul de tous les prix temporaires stockés dans le tableau "totalPrices"
             * @return Number
             */
            const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

            let reservation = new Reservation({
                user: req.body.user,
                orderItems: orderItemIds,
                status: req.body.status,
                note: req.body.note,
                totalPrice: totalPrice,
                dateReservated: req.body.dateReservated,
            })

            reservation = await reservation.save()

            if (!reservation) {
                return res.status(500).send('The Reservation cannot be craeted')
            }

            res.send(reservation)
        } catch (error) {
            throw Error(`Error while create reservation : ${error}`)
        }
    },

    /**
     * Mettre à jour une reservation via son ID
     * @method findByIdAndUpdate()
     * @method isValidObjectId()
     * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
     */
    async updateReservationById(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).send('Invalid reservation Id')
            }

            // Vérifier si la reservation existe
            const reservation = await Reservation.findById(req.params.id)
            if (!reservation) {
                return res.status(400).send('Reservation no found')
            }

            const updatedReservation = await Reservation.findByIdAndUpdate(
                req.params.id,
                {
                    status: req.body.status,
                },
                { new: true }
            )

            if (!updatedReservation) {
                return res.status(500).send('the reservation cannot be updated')
            }

            res.send(updatedReservation)
        } catch (error) {
            throw Error(`Error while updateing reservation : ${error}`)
        }
    },

    /**
     * Suppression d'une reservation via son ID
     * @see http://localhost:3000/api/v1/reservations/:id
     * @param id identifiant de la reservation à supprimer
     */
    async deleteReservationById(req, res) {
        try {
            Reservation.findByIdAndDelete(req.params.id)
                .then(async (reservation) => {
                    if (reservation) {
                        // supprimer tous les orderItems contenus dans la reservations
                        await reservation.orderItems.map(
                            async (orderItemId) => {
                                await OrderItem.findByIdAndDelete(orderItemId)
                            }
                        )
                        return res.status(200).json({
                            success: true,
                            message: 'The reservation is deleted',
                        })
                    } else {
                        return res.status(404).json({
                            success: false,
                            message: 'reservation not found !',
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
            throw Error(`Error while deleting reservation : ${error}`)
        }
    },

    /**
     * Methode qui permet de calculer le nombre des Reservations dans la collections Reservations
     * @method countDocuments()
     * @see http://localhost:3000/api/v1/reservations/get/count
     */
    async getCountAllReservation(req, res) {
        try {
            const reservationCount = await Reservation.countDocuments(
                (count) => count
            )

            if (!reservationCount) {
                res.status(500).json({
                    success: false,
                })
            }
            res.send({
                reservationCount: reservationCount,
            })
        } catch (error) {
            throw Error(`Error while getting count reservation : ${error}`)
        }
    },
}