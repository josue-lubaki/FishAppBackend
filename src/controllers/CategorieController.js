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
        const categoryList = await Category.find().catch((err) =>
            console.log(err)
        )

        if (!categoryList) {
            res.status(500).json({
                success: false,
            })
        } else {
            res.status(200).send(categoryList)
        }
    },

    /**
     * Récupérer une category à partir de son ID
     * @method findById()
     * @see /api/v1/categories/:id
     */
    async getCategorieById(req, res) {
        const category = await Category.findById(req.params.id).catch((err) =>
            console.log(err)
        )
        if (!category) {
            return res.status(500).json({
                message: 'The category with the given ID was not found !',
            })
        } else {
            return res.status(200).send(category)
        }
    },

    /**
     * Création d'une nouvelle Category dans la collection catégories
     * @method save()
     * @method send()
     * @see /api/v1/categories
     */
    async createCategorie(req, res) {
        let category = await Category.create({ ...req.body })

        if (!category) {
            return res.status(404).send('the category cannot be created')
        } else {
            res.send(category)
        }
    },

    /**
     * Suppression d'une category dans la collection Categories
     * @method findByIdAndDelete()
     * @see /api/v1/categories/:id
     */
    async deleteCategorieById(req, res) {
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
    },

    /**
     * La Mise à jour d'un enregistrement via son ID
     * @method findByIdAndUpdate()
     * @see {new : true} : pour demander le renvoi de la nouvelle mise à jour et non l'ancienne
     */
    async updateCategorieById(req, res) {
        mongoose.set('useFindAndModify', false) // https://mongoosejs.com/docs/deprecations.html#findandmodify
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid category ID')
        }
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                color: req.body.color,
            },
            { new: true }
        )

        if (!category) {
            return res.status(400).send('the category cannot be update')
        } else {
            res.send(category)
        }
    },

    /**
     * Methode qui permet de calculer le nombre des Products dans la collections Products
     * @method countDocuments()
     * @see http://localhost:3000/api/v1/categories/get/count
     */
    async getCountCategories(req, res) {
        const categorieCount = await Category.countDocuments((count) => count)

        if (categorieCount === 0) {
            return res.status(200).json({
                categorieCount: 0,
            })
        } else if (!categorieCount) {
            return res.status(500).json({
                success: false,
            })
        }

        return res.send({
            categorieCount: categorieCount,
        })
    },
}
