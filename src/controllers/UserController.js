const { User } = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

module.exports = {
    /**
     * Récupération de tous les Utilisateurs
     * @method find()
     * @see http://localhost:3000/api/v1/users
     */
    async getAllUsers(req, res) {
        try {
            const userList = await User.find()
                .select('-passwordHash')
                .catch((err) => console.log(err))

            if (!userList) {
                return res.status(500).json({
                    success: false,
                })
            }
            return res.status(200).json(userList)
        } catch (error) {
            throw Error(`Error while getting All Users : ${error}`)
        }
    },

    /**
     * Récupération d'un Utilisateur grâce à son ID
     * @see http://localhost:3000/api/v1/users/[:id]
     */
    async getUserById(req, res) {
        try {
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
        } catch (error) {
            throw Error(
                `Error while getting Information a User by ID : ${error}`
            )
        }
    },

    /**
     * Methode qui permet de calculer le nombre des Utilisateurs dans la collections Users
     * @method countDocuments()
     * @see http://localhost:3000/api/v1/users/get/count
     */
    async getCountUser(req, res) {
        try {
            const userCount = await User.countDocuments((count) => count)

            if (!userCount) {
                return res.status(500).json({
                    success: false,
                })
            }
            res.send({
                userCount: userCount,
            })
        } catch (error) {
            throw Error(`Error while Count All User : ${error}`)
        }
    },

    /**
     * Création d'un Utilisateur
     * @method findById()
     * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
     * @see http://localhost:3000/api/v1/users
     */
    async createUser(req, res) {
        try {
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
        } catch (error) {
            throw Error(`Error while Creation User : ${error}`)
        }
    },

    /**
     * Methode qui permet de logger un Utilisateur
     * @method findOne()
     * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
     */
    async login(req, res) {
        try {
            // Vérifier si l'Utilisateur existe vai son email
            const user = await User.findOne({ email: req.body.email })
            const secret = process.env.secret
            if (!user) {
                return res.status(400).send('The user not found')
            }

            if (
                user &&
                bcrypt.compareSync(req.body.password, user.passwordHash)
            ) {
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
        } catch (error) {
            throw Error(`Error while login User : ${error}`)
        }
    },

    /**
     * Methode qui permet d'enregistrer un Utilisateur
     * @method findOne()
     * @method jwt.sign(base_du_token, mot_secret, delai_de_vie_du_token)
     */
    async register(req, res) {
        try {
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

            // Vérifier si l'Utilisateur existe déjà
            const existUser = await User.findOne({ email: req.body.email })

            if (!existUser) {
                user = user.save()

                if (!user) {
                    return res.status(400).send('The user cannot be created')
                }

                return jwt.sign(
                    {
                        userId: user.id,
                        isAdmin: user.isAdmin,
                    },
                    process.env.secret,
                    (err, token) => {
                        return res.json({
                            user: req.body.email,
                            token: token,
                        })
                    }
                )
            } else {
                res.status(400).json({
                    message:
                        'email already exist ! do you want to login instaed ?',
                })
            }
        } catch (error) {
            throw Error(`Error while Register new User : ${error}`)
        }
    },

    /**
     * Mise à jour des informations de l'Utilisateur
     * @method findById()
     * @method bcrypt.hashSync(text, salt)
     * @see http://localhost:3000/api/v1/users/[:id]
     */
    async updateInfoUserById(req, res) {
        try {
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
        } catch (error) {
            throw Error(`Error while Update Information User : ${error}`)
        }
    },

    /**
     * Suppression d'un Utilisateur via son ID
     * @param id identifiant de l'Utlisateur à supprimer
     */
    async deleteUserById(req, res) {
        try {
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
        } catch (error) {
            throw Error(`Error while deleting an user : ${error}`)
        }
    },

    async existUser(req, res) {
        try {
            const user = await User.findById(req.params.id).catch((err) =>
                console.log(err)
            )

            if (!user) {
                return res.status(500).json({
                    success: false,
                    message: 'The user with the given ID was not found',
                })
            } else {
                return res.status(200).send({
                    success: true,
                    message: 'User exist',
                })
            }
        } catch (error) {
            throw Error(
                `Error while getting Information a User by ID : ${error}`
            )
        }
    },
}
