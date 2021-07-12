const { Category } = require('../models/category')
const mongoose = require('mongoose')

module.exports = {
    /**
     * Récuperation des caterogies contenues dans la collection Categories
     * @method find()
     * @method send()
     * @see /api/v1/categories
     */
    async getAllCategories(req, res) {
        try {
            const categoryList = await Category.find().catch((err) =>
                console.log(err)
            )

            if (!categoryList) {
                res.status(500).json({
                    success: false,
                })
            }
            res.status(200).send(categoryList)
        } catch (error) {
            throw new Error(`Error while getting All Users : ${error}`)
        }
    },

    /**
     * Récupérer une category à partir de son ID
     * @method findById()
     * @see /api/v1/categories/:id
     */
    async getCategorieById(req, res) {
        try {
            const category = await Category.findById(req.params.id).catch(
                (err) => console.log(err)
            )
            if (!category) {
                return res.status(500).json({
                    message: 'The category with the given ID was not found !',
                })
            } else {
                return res.status(200).send(category)
            }
        } catch (error) {
            throw new Error(`Error while getting All Users : ${error}`)
        }
    },

    /**
     * Création d'une nouvelle Category dans la collection catégories
     * @method save()
     * @method send()
     * @see /api/v1/categories
     */
    async createCategorie(req, res) {
        try {
            let category = new Category({
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            })

            category = await category.save()

            if (!category) {
                return res.status(404).send('the category cannot be created')
            }

            res.send(category)
        } catch (error) {
            throw new Error(`Error while creating a category : ${error}`)
        }
    },

    /**
     * Suppression d'une category dans la collection Categories
     * @method findByIdAndDelete()
     * @see /api/v1/categories/:id
     */
    async deleteCategorieById(req, res) {
        try {
            Category.findByIdAndDelete(req.params.id)
                .then((category) => {
                    if (category) {
                        return res.status(200).json({
                            success: true,
                            message: 'The category is deleted',
                        })
                    } else {
                        return res.status(404).json({
                            success: false,
                            message: 'category not found !',
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
            throw new Error(`Error while deleting a category : ${error}`)
        }
    },

    /**
     * La Mise à jour d'un enregistrement via son ID
     * @method findByIdAndUpdate()
     * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
     */
    async updateCategorieById(req, res) {
        try {
            mongoose.set('useFindAndModify', false) // https://mongoosejs.com/docs/deprecations.html#findandmodify
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).send('Invalid category ID')
            }
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    icon: req.body.icon,
                    color: req.body.color,
                },
                { new: true }
            )

            if (!category) {
                return res.status(400).send('the category cannot be update')
            }

            res.send(category)
        } catch (error) {
            throw new Error(`Error while updating a category : ${error}`)
        }
    },
}
