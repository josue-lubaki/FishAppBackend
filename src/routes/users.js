const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')

/**
 * Récupération de tous les Utilisateurs
 * @method find()
 * @see http://localhost:3000/api/v1/users
 */
router.get(`/`, UserController.getAllUsers)

/**
 * Récupération d'un Utilisateur grâce à son ID
 * @see http://localhost:3000/api/v1/users/[:id]
 */
router.get('/:id', UserController.getUserById)

/**
 * Création d'un Utilisateur
 * @method findById()
 * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
 * @see http://localhost:3000/api/v1/users
 */
router.post(`/`, UserController.createUser)

/**
 * Mise à jour des informations de l'Utilisateur
 * @method findById()
 * @method bcrypt.hashSync(text, salt)
 * @see http://localhost:3000/api/v1/users/[:id]
 */
router.put('/:id', UserController.updateInfoUserById)

/**
 * Methode qui permet de logger un Utilisateur
 * @method findOne()
 * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
 */
router.post('/login', UserController.login)

/**
 * Methode qui permet d'enregistrer un Utilisateur
 * @method findOne()
 * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
 */
router.post('/register', UserController.register)

/**
 * Methode qui permet de calculer le nombre des Utilisateurs dans la collections Users
 * @method countDocuments()
 * @see http://localhost:3000/api/v1/users/get/count
 */
router.get('/get/count', UserController.getCountUser)

/**
 * Suppression d'un Utilisateur via son ID
 * @param id identifiant de l'Utlisateur à supprimer
 */
router.delete(`/:id`, UserController.deleteUserById)

module.exports = router
