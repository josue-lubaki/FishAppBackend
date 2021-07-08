const express = require('express')
const router = express.Router()
const ReservationController = require('../controllers/ReservationController')

/**
 * Récupération de tous les reservation
 * @see http://localhost:3000/api/v1/reservations
 */
router.get(`/`, ReservationController.getAllReservations)

/**
 * Récupération d'une reservation grâce à son ID
 * @param id identifiant de la Reservation à récupérer
 * @see http://localhost:3000/api/v1/Reservations/:id
 * @return Reservation
 */
router.get('/:id', ReservationController.getReservationById)

/**
 * Création d'une reservation dans la collection Reservation
 * @method findById()
 * @method single(fieldNameModel)
 * @see http://localhost:3000/api/v1/Reservations
 */
router.post(`/`, ReservationController.createReservation)

/**
 * Mettre à jour un reservation via son ID
 * @method findByIdAndUpdate()
 * @method isValidObjectId()
 * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
 */
router.put('/:id', ReservationController.updateReservationById)

/**
 * Suppression d'une reservation via son ID
 * @see http://localhost:3000/api/v1/Reservations/:id
 * @param id identifiant de la Reservation à supprimer
 */
router.delete(`/:id`, ReservationController.deleteReservationById)

/**
 * Methode qui permet de calculer le nombre des Reservations dans la collections Reservations
 * @method countDocuments()
 * @see http://localhost:3000/api/v1/Reservations/get/count
 */
router.get('/get/count', ReservationController.getCountAllReservation)

module.exports = router
