const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')

/**
 * Récupération de toutes les commandes d'achat de la collection Orders
 * @see name of user object
 * @see order sorted by dateOrdered
 * @see http://localhost:3000/api/v1/orders
 */
router.get(`/`, OrderController.getAllOrders)

/**
 * Récupération d'une seule commande de la collection Orders
 * @see populate -> user{name} ; orderItems ; product ; category
 * @see http://localhost:3000/api/v1/orders/:id
 */
router.get(`/:id`, OrderController.getOrderById)

/**
 * Création d'une nouvelle Category dans la collection catégories
 * @method save()
 * @method send()
 * @see /api/v1/orders
 * @see http://localhost:3000/api/v1/orders
 */
router.post('/', OrderController.createOrder)

/**
 * Mettre à jour le status d'une commande via son ID
 * @method findByIdAndUpdate()
 * @method isValidObjectId()
 * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
 * @see http://localhost:3000/api/v1/orders/:id
 */
router.put('/:id', OrderController.updateOrderById)

/**
 * Mettre à jour la note d'une commande via son ID
 * @method findByIdAndUpdate()
 * @method isValidObjectId()
 * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
 * @see http://localhost:3000/api/v1/orders/notes/:id
 */
router.put('/notes/:id', OrderController.updateNotesOrderById)

/**
 * Suppression d'une commande dans la collection Categories
 * @method findByIdAndDelete()
 * @see /api/v1/orders/:id
 * @see orderItem les ID contenus dans le tableau OrderItems[]
 * @see http://localhost:3000/api/v1/orders/:id
 */
router.delete('/:id', OrderController.deleteOrderById)

/**
 * connaître la somme totale des commandes Vendues
 * @method aggregate ({$group: {_id:null, name : { $fonctionAggregate : 'nameFieldModel' } } })
 * @see http://localhost:3000/api/v1/orders/get/totalsales
 */
router.get('/get/totalsales', OrderController.getTotalSales)

/**
 * Methode qui permet de calculer le nombre des Products dans la collections Products
 * @method countDocuments()
 * @see http://localhost:3000/api/v1/orders/get/count
 */
router.get('/get/count', OrderController.getCountOrders)

/**
 * Récupération du detail d'une commande d'un utilisation via son ID
 * @see http://localhost:3000/api/v1/orders/get/userorder/[:userid]
 */
router.get(`/get/userorder/:userid`, OrderController.getOrderUserById)

module.exports = router
