const { User } = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

/**
 * Récupération de tous les Utilisateurs
 * @method find()
 * @see http://localhost:3000/api/v1/users
 */
router.get(`/`, async (req, res) => {
    const userList = await User.find()
        .select('-passwordHash')
        .catch((err) => console.log(err))

    if (!userList) {
        res.status(500).json({
            success: false,
        })
    }
    res.send(userList)
})

/**
 * Récupération d'un Utilisateur grâce à son ID
 * @see http://localhost:3000/api/v1/users/[:id]
 */
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-passwordHash')
        .catch((err) => console.log(err))

    if (!user) {
        res.status(500).json({
            success: false,
            message: 'The user with the given ID was not found',
        })
    }
    res.status(200).send(user)
})

/**
 * Création d'un Utilisateur
 * @method findById()
 * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
 * @see http://localhost:3000/api/v1/users
 */
router.post(`/`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        avenue: req.body.avenue,
        apartment: req.body.apartment,
        quartier: req.body.quartier,
        commune: req.body.commune,
        city: req.body.city,
        country: req.body.country,
    })

    user = await user.save()

    if (!user) {
        return res.status(400).send('The user cannot be created !')
    }

    res.send(user)
})

/**
 * Mise à jour des informations de l'Utilisateur
 * @method findById()
 * @method bcrypt.hashSync(text, salt)
 * @see http://localhost:3000/api/v1/users/[:id]
 */
router.put('/:id', async (req, res) => {
    mongoose.set('useFindAndModify', false) // https://mongoosejs.com/docs/deprecations.html#findandmodify
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid user ID')
    }

    // Vérifier l'existence de l'Utilisateur
    const userExist = await User.findById(req.params.id).catch((err) =>
        console.log(err)
    )
    let newPasswordHash
    if (req.body.password) {
        newPasswordHash = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPasswordHash = userExist.passwordHash
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPasswordHash,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true }
    )

    if (!user) {
        return res.status(400).send('The user cannot be update !')
    }
    res.send(user)
})

/**
 * Methode qui permet de logger un Utilisateur
 * @method findOne()
 * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
 */
router.post('/login', async (req, res) => {
    // Vérifier si l'Utilisateur existe vai son email
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.secret
    if (!user) {
        return res.status(400).send('The user not found')
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret,
            { expiresIn: '1d' }
        )
        res.status(200).send({
            user: user.email,
            token: token,
        })
    } else {
        res.status(400).send('Password is wrong')
    }
})

/**
 * Methode qui permet d'enregistrer un Utilisateur
 * @method findOne()
 * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
 */
router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    user = user.save()

    if (!user) {
        return res.status(400).send('The user cannot be created')
    }

    res.send(user)
})

/**
 * Methode qui permet de calculer le nombre des Utilisateurs dans la collections Users
 * @method countDocuments()
 * @see http://localhost:3000/api/v1/users/get/count
 */
router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments((count) => count)

    if (!userCount) {
        res.status(500).json({
            success: false,
        })
    }
    res.send({
        userCount: userCount,
    })
})

/**
 * Suppression d'un Utilisateur via son ID
 */
router.delete(`/:id`, async (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (user)
                return res.status(200).json({
                    success: true,
                    message: 'The user is deleted',
                })
            else {
                return res.status(404).json({
                    success: false,
                    message: 'user not found !',
                })
            }
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                error: err,
            })
        })
})

module.exports = router
