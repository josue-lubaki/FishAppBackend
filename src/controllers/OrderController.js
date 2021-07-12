const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')
const mongoose = require('mongoose')

module.exports = {
    /**
     * Récupération de toutes les commandes d'achat de la collection Orders
     * @see name of user object
     * @see order sorted by dateOrdered
     */
    async getAllOrders(req, res) {
        const orderList = await Order.find()
            .populate('user', 'name')
            .sort({ dateOrdered: -1 })
            .catch((err) => console.log(err))

        if (!orderList) {
            return res.status(500).json({
                success: false,
            })
        }
        return res.send(orderList)
    },

    /**
     * Récupération d'une seule commande de la collection Orders
     * @see populate -> user{name} ; orderItems ; product ; category
     */
    async getOrderById(req, res) {
        const order = await Order.findById(req.params.id)
            .populate('user', ['name', 'phone', 'email'])
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' },
            })
            .catch((err) => console.log(err))

        if (!order) {
            return res.status(500).json({
                success: false,
            })
        }
        return res.send(order)
    },

    /**
     * Création d'une nouvelle Category dans la collection catégories
     * @method save()
     * @method send()
     * @see /api/v1/orders
     */
    async createOrder(req, res) {
        // Création des OrdersItems de la commande
        // @return String[]
        const orderItemIds = await Promise.all(
            req.body.orderItems.map(async (orderItem) => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                })

                newOrderItem = await newOrderItem.save()
                return newOrderItem._id
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

        // création de l'Objet Order de la collection Orders
        // @return Order
        let order = new Order({
            orderItems: orderItemIds,
            avenue: req.body.avenue,
            apartment: req.body.apartment,
            quartier: req.body.quartier,
            commune: req.body.commune,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        })

        order = await order.save()

        if (!order) {
            return res.status(404).send('the order cannot be created')
        }

        res.send(order)
    },

    /**
     * Mettre à jour le status d'une commande via son ID
     * @method findByIdAndUpdate()
     * @method isValidObjectId()
     * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
     */
    async updateOrderById(req, res) {
        mongoose.set('useFindAndModify', false) // https://mongoosejs.com/docs/deprecations.html#findandmodify
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid order ID')
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
            },
            { new: true }
        ).catch((err) => console.log(err))

        if (!order) {
            return res.status(400).send('the order cannot be update')
        }

        res.send(order)
    },

    /**
     * Suppression d'une commande dans la collection Categories
     * @method findByIdAndDelete()
     * @see /api/v1/orders/:id
     * @see orderItem les ID contenus dans le tableau OrderItems[]
     */
    async deleteOrderById(req, res) {
        Order.findByIdAndDelete(req.params.id)
            .then(async (order) => {
                if (order) {
                    await order.orderItems.map(async (orderItem) => {
                        await OrderItem.findByIdAndDelete(orderItem)
                    })
                    return res.status(200).json({
                        success: true,
                        message: 'The order is deleted',
                    })
                } else {
                    return res.status(404).json({
                        success: false,
                        message: 'order not found !',
                    })
                }
            })
            .catch((err) => {
                return res.status(400).json({
                    success: false,
                    error: err,
                })
            })
    },

    /**
     * connaître la somme totale des commandes Vendues
     * @method aggregate ({$group: {_id:null, name : { $fonctionAggregate : 'nameFieldModel' } } })
     * @see http://localhost:3000/api/v1/orders/get/totalsales
     */
    async getTotalSales(req, res) {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: `$totalPrice` } } },
        ]).catch(
            (err = (err) => {
                console.error(err)
            })
        )

        if (!totalSales) {
            return res.status(400).send('The order sales cannot be generated')
        }

        res.send({ totalSales: totalSales.pop().totalSales })
    },

    /**
     * Methode qui permet de calculer le nombre des Products dans la collections Products
     * @method countDocuments()
     * @see http://localhost:3000/api/v1/orders/get/count
     */
    async getCountOrders(req, res) {
        const orderCount = await Order.countDocuments((count) => count)

        if (orderCount === 0) {
            return res.status(200).json({
                orderCount: 0,
            })
        } else if (!orderCount) {
            return res.status(500).json({
                success: false,
            })
        }

        return res.send({
            orderCount: orderCount,
        })
    },

    /**
     * Récupération du detail d'une commande d'un utilisation via son ID
     * @see http://localhost:3000/api/v1/orders/get/userorder/[:userid]
     */
    async getOrderUserById(req, res) {
        if (!mongoose.isValidObjectId(req.params.userid)) {
            return res.status(400).send('Invalid user Id')
        }

        const userOrderList = await Order.find({ user: req.params.userid })
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' },
            })
            .sort({ dateOrdered: -1 })

        if (!userOrderList) {
            return res.status(500).json({
                success: false,
            })
        }
        res.send(userOrderList)
    },
}