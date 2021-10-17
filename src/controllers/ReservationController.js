const { Reservation } = require('../models/reservation')
const { OrderItem } = require('../models/order-item')
const { User } = require('../models/user')
const { Product } = require('../models/product')
const mongoose = require('mongoose')
const nodemailer = require('../../helpers/nodemailer')
const ControllerUser = require('./UserController')
const accountSid = process.env.ACCOUNTSIDTWILIO
const authToken = process.env.AUTHTOKENTWILIO
const client = require('twilio')(accountSid, authToken)

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
                user: req.body.user, // ID user
                orderItems: orderItemIds,
                status: req.body.status,
                totalPrice: totalPrice,
                dateReservated: req.body.dateReservated,
                avenue: req.body.avenue,
                quartier: req.body.quartier,
                commune: req.body.commune,
                apartment: req.body.apartment,
                city: req.body.city,
                country: req.body.country,
                notes: req.body.notes,
            })

            reservation = await reservation.save()

            if (!reservation) {
                return res.status(500).send('The Reservation cannot be created')
            }

            res.send(reservation)

            // Send message to customer
            await ControllerUser.getUserByIdMethode(req.body.user).then(
                async (result) => {
                    const options = {
                        from: process.env.userEmail,
                        to: `${result.email}`,
                        subject: 'Confirmation Reservation',
                        html: `Merci Beaucoup pour votre confiance en notre équipe.
                <br>Votre Réservation fait un montant de <b>${totalPrice} USD</b>.<br>
                Dirigez-vous vers :
                https://josue-lubaki.github.io/psk/ ensuite sur compte pour voir l'état de votre réservation.
                <br><br>
                
                Thank you very much for your trust in our team.
                <br>Your reservation is worth <b>${totalPrice} USD</b>.<br>
                Head to:
                https://josue-lubaki.github.io/psk/ then on account to see the status of your reservation.
                <br>Thanks, have a good day`,
                    }

                    await nodemailer.sendMail(options, function (err, res) {
                        if (err) {
                            console.error(err)
                            return
                        }

                        console.log('sent : ' + res.response)
                    })

                    await client.messages
                        .create({
                            body: `Merci Beaucoup pour votre confiance en notre équipe.
                            
Votre Réservation fait un montant de ${totalPrice} USD
Dirigez-vous vers :
https://josue-lubaki.github.io/psk/ ensuite sur compte pour voir l'état de votre réservation.


Thank you very much for your trust in our team.
Your reservation is worth ${totalPrice} USD
Head to:
https://josue-lubaki.github.io/psk/ then on account to see the status of your reservation.
Thanks, have a good day`,
                            messagingServiceSid:
                                process.env.MESSAGING_TWILIO_SERVICE,
                            to: result.phone,
                        })
                        .then((message) => console.log(message.sid))
                        .done()

                    console.log('email to : ', result.email)
                    console.log('SMS send to : ', result.phone)
                }
            )

            // Réduire le nombre des produits à l'inventaire
            await Promise.all(
                req.body.orderItems.map(async (orderItem) => {
                    let newOrderItem = new OrderItem({
                        quantity: orderItem.quantity,
                        product: orderItem.product,
                    })

                    // Vérifier l'ID du produit
                    if (!mongoose.isValidObjectId(newOrderItem.product)) {
                        return res.status(400).send('Invalid Produit Id')
                    }

                    // Vérifier si le produit existe
                    const product = await Product.findById(newOrderItem.product)
                    if (!product) {
                        return res.status(400).send('Invalid Product')
                    }

                    const nouvelleValeur =
                        product.countInStock - newOrderItem.quantity

                    // proceder à la reductione de product
                    const updatedProduct = await Product.findByIdAndUpdate(
                        newOrderItem.product,
                        {
                            countInStock: nouvelleValeur,
                        },
                        { new: true }
                    )

                    if (!updatedProduct) {
                        return res
                            .status(500)
                            .send('the product cannot be updated')
                    }
                })
            ).catch((err) => console.log(err))
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
            } else {
                res.send(updatedReservation)
            }
        } catch (error) {
            throw Error(`Error while updateing reservation : ${error}`)
        }
    },

    /**
     * Mettre à jour la note d'une commande via son ID
     * @method findByIdAndUpdate()
     * @method isValidObjectId()
     * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
     */
    async updateNotesReservationById(req, res) {
        mongoose.set('useFindAndModify', false) // https://mongoosejs.com/docs/deprecations.html#findandmodify
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid order ID')
        }

        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            {
                notes: req.body.notes,
            },
            { new: true }
        ).catch((err) => console.log(err))

        if (!reservation) {
            return res.status(400).send('the order cannot be update')
        } else {
            res.send(reservation)
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

            if (reservationCount === 0) {
                return res.status(200).json({
                    reservationCount: 0,
                })
            } else if (!reservationCount) {
                return res.status(500).json({
                    success: false,
                    message: 'Problème lors de la generation',
                })
            } else {
                res.send({
                    reservationCount: reservationCount,
                })
            }
        } catch (error) {
            throw Error(`Error while getting count reservation : ${error}`)
        }
    },

    /**
     * connaître la somme totale des Commandes Reservées
     * @method aggregate ({$group: {_id:null, name : { $fonctionAggregate : 'nameFieldModel' } } })
     * @see http://localhost:3000/api/v1/reservations/get/totalreserved
     */
    async getTotalReserved(req, res) {
        try {
            const totalReserved = await Reservation.aggregate([
                {
                    $group: {
                        _id: null,
                        totalReserved: { $sum: `$totalPrice` },
                    },
                },
            ]).catch(
                (err = (err) => {
                    console.error(
                        `Error while try Reservation.aggregate : ${err}`
                    )
                })
            )

            if (!totalReserved) {
                return res.status(400).json({
                    success: false,
                    message: 'The reservation sales cannot be generated',
                })
            }

            if (totalReserved && totalReserved.length === 0) {
                return res.status(200).json({
                    totalReserved: 0,
                })
            } else {
                res.send({ totalReserved: totalReserved.pop().totalReserved })
            }
        } catch (error) {
            throw new Error(
                `Error while getting Total Reserved of Reservation : ${error}`
            )
        }
    },
    /**
     * Récupération du detail d'une commande d'un utilisation via son ID
     * @see http://localhost:3000/api/v1/reservations/get/user/[:userid]
     */
    async getReservationsUserById(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.userid)) {
                return res.status(400).send('Invalid user Id')
            }

            const userReservationList = await Reservation.find({
                user: req.params.userid,
            })
                .populate({
                    path: 'orderItems',
                    populate: { path: 'product', populate: 'category' },
                })
                .sort({ dateReservated: -1 })

            if (!userReservationList) {
                return res.status(500).json({
                    success: false,
                })
            } else {
                res.send(userReservationList)
            }
        } catch (error) {
            throw new Error(
                `Error while try getting an reservation by Id : ${error}`
            )
        }
    },
}
