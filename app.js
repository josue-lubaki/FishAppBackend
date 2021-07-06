const express = require('express')
const app = express()
/**************************************** */
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const connexionDB = require('./config/database')
/**************************************** */
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(morgan('tiny'))
/**************************************** */
const PORT = process.env.PORT || 3000
/**************************************** */

// connexcion de la base des données
connexionDB()

// Routers
const categoriesRoutes = require('./src/routes/categories.js')
const productsRoutes = require('./src/routes/products')
const usersRoutes = require('./src/routes/users')
const ordersRoutes = require('./src/routes/orders')
const api = process.env.API_URL

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

app.listen(PORT, () => {
    console.log('Welcome : http://localhost:3000/api/v1/')
})
