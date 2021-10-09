const express = require('express')
const router = express.Router()
const ReservationController = require('../controllers/ReservationController')

/**
 * Récupération de tous les reservation
 * @see http://localhost:3000/api/v1/reservations
 * @retun { reservation || success : "value"}
 */
router.get(`/`, ReservationController.getAllReservations)

/**
 * Récupération d'une reservation grâce à son ID
 * @param id identifiant de la Reservation à récupérer
 * @see http://localhost:3000/api/v1/Reservations/:id
 * @retun { reservation || success : "value"}
 */
router.get('/:id', ReservationController.getReservationById)

/**
 * Création d'une reservation dans la collection Reservation
 * @method findById()
 * @method single(fieldNameModel)
 * @see http://localhost:3000/api/v1/Reservations
 * @return { Reservation || success : "value"}
 */
router.post(`/`, ReservationController.createReservation)

/**
 * Mettre à jour un reservation via son ID
 * @method findByIdAndUpdate()
 * @method isValidObjectId()
 * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
 * @return { Reservation }
 */
router.put('/:id', ReservationController.updateReservationById)

/**
 * Mettre à jour la note d'une reservation via son ID
 * @method findByIdAndUpdate()
 * @method isValidObjectId()
 * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
 * @see http://localhost:3000/api/v1/reservation/notes/:id
 * @return { Order }
 */
router.put('/notes/:id', ReservationController.updateNotesReservationById)

/**
 * Suppression d'une reservation via son ID
 * @see http://localhost:3000/api/v1/Reservations/:id
 * @param id identifiant de la Reservation à supprimer
 * @return {success : "value", message : "value"}
 */
router.delete(`/:id`, ReservationController.deleteReservationById)

/**
 * Methode qui permet de calculer le nombre des Reservations dans la collections Reservations
 * @method countDocuments()
 * @see http://localhost:3000/api/v1/reservations/get/count
 * @return { reservationCount:"value" || success : "value", message : "value" }
 */
router.get('/get/count', ReservationController.getCountAllReservation)

/**
 * connaître la somme totale des Commandes Reservées
 * @method aggregate ({$group: {_id:null, name : { $fonctionAggregate : 'nameFieldModel' } } })
 * @see http://localhost:3000/api/v1/orders/get/totalreserved
 * @return { totalReserved:"value" || success : "value", message : "value"}
 */
router.get('/get/totalreserved', ReservationController.getTotalReserved)

/**
 * Récupération de la liste des reservations d'un utilisation via son ID
 * @see http://localhost:3000/api/v1/reservations/get/user/[:userid]
 * @return { Reservation || success : "value"}
 */
router.get(`/get/user/:userid`, ReservationController.getReservationsUserById)

module.exports = router
