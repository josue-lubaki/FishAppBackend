const express = require('express')
const app = express()
/**************************************** */
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const database = require('./db/database')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')
/**************************************** */
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errorHandler)
/**************************************** */
const PORT = process.env.PORT || 3000
/**************************************** */

// all executed methods log output to console
mongoose.set('debug', true)

// get mongodb-shell friendly output (ISODate)
mongoose.set('debug', { shell: true })

// connexion de la base des données
database.connexionDB().then(() => {
    app.listen(PORT, () => {
        console.log('Welcome : http://localhost:3000/api/v1/')
    })
})

// Routers
const categoriesRoutes = require('./src/routes/categories')
const productsRoutes = require('./src/routes/products')
const usersRoutes = require('./src/routes/users')
const ordersRoutes = require('./src/routes/orders')
const reservationRoutes = require('./src/routes/reservation')
const bannersRoutes = require('./src/routes/bannersRoutes')
const api = process.env.API_URL

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)
app.use(`${api}/reservations`, reservationRoutes)
app.use(`${api}/banners`, bannersRoutes)
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

module.exports = app
