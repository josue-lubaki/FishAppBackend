const express = require('express')
const serverless = require('serverless-http')
const app = express()
const firebase = require('firebase')
/**************************************** */
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
/**************************************** */
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
/**************************************** */
const PORT = process.env.PORT || 3000
/**************************************** */

// Initialisation de firebase
const firebaseConfig = {
    apiKey: 'AIzaSyCxzdY2iXQmTfFCK93cwYtE3QV5brDr4LM',
    authDomain: 'fish-app-6d608.firebaseapp.com',
    projectId: 'fish-app-6d608',
    storageBucket: 'fish-app-6d608.appspot.com',
    messagingSenderId: '963172696631',
    appId: '1:963172696631:web:05a71d3b9580b115a475b2',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// appelé avant le démarrage du server
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true, // Pour lui dire que j'utilise un nouveau ParserJSON @see express.json()
        useUnifiedTopology: true,
        dbName: 'shop-database',
    })
    .then(() => {
        console.log('Database connection is ready')
    })
    .catch((error) => {
        console.log('error database MongoDB : ' + error)
    })

// Routers
const categoriesRoutes = require('./routes/categories.js')
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const ordersRoutes = require('./routes/orders')
const imageRoutes = require('./routes/image')
const api = process.env.API_URL

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

app.listen(PORT, () => {
    console.log('Welcome : \nhttp://localhost:3000/api/v1/')
})

module.exports.handler = serverless(app)
