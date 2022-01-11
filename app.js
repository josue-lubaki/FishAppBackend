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
const xss = require('xss-clean')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
/**************************************** */
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errorHandler)
app.use(xss())
/**************************************** */
const PORT = process.env.PORT || 3000
/**************************************** */

mongoose.set('debug', false)

app.get('/', (req, res) => {
    res.send(`
       <html>
        <head>
            <title>FishApp - API</title>
            <link rel="icon" href="https://ufmmmw.dm.files.1drv.com/y4mqGPFwLkEdHv8neWQT2u2Je_MO6STFzrf3UPzVZV3NMhELKnwb4qizeWCr62wEEyJiNPCK1JwjBMSe02runDXvwe39soqsOtSsj_cYViwru89VXvuUj853rVLx3yByFt9PmtXDU-SijeKaEdETjZ1uNqBQUV0szbCzv-Ad7Q0qRYvG2MmWK5Xg_NUE24pQlpJ-OR9MUUFdIafyglmlMwErg/android-chrome-512x512.png?psid=1"/>
        </head>
        <body>
            <style>
            * {
                box-sizing: border-box;
            }
            body {
                display: flex;
                background-color: rgba(202, 160, 160, 0.096);
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0 auto;
                flex-direction: column;
            }
            ul {
                list-style: none;
                list-style-type: none;
                text-align: center;
                margin: 0;
                padding: 0;
            }
            li {
                padding: 10px;
                margin: 10px auto;
                background-color: rgba(45, 142, 172, 0.308);
                width: 50%;
            }
            li:hover {
                background-color: rgba(45, 142, 172, 0.801);
            }
            a {
                color: black;
                font-weight: bold;
                text-decoration: none;
            }
            .container {
                background-color: rgba(45, 142, 172, 0.13);
                padding: 2rem 0;
                text-align: center;
                width: 75%;
            }
            img {
                width: 25%;
                height: auto;
            }
            </style>
            <div class="container">
            <img
                src="https://ufmmmw.dm.files.1drv.com/y4mqGPFwLkEdHv8neWQT2u2Je_MO6STFzrf3UPzVZV3NMhELKnwb4qizeWCr62wEEyJiNPCK1JwjBMSe02runDXvwe39soqsOtSsj_cYViwru89VXvuUj853rVLx3yByFt9PmtXDU-SijeKaEdETjZ1uNqBQUV0szbCzv-Ad7Q0qRYvG2MmWK5Xg_NUE24pQlpJ-OR9MUUFdIafyglmlMwErg/android-chrome-512x512.png?psid=1"
                alt="avatar"
            />
            <h1>FishApp - API</h1>
            <ul>
                <a href="/docs"><li>Documentation</li></a>
                <a href="https://josue-lubaki.ca" target="_blank" rel="noopener noreferrer"><li>Portfolio</li></a>
                <a href="https://github.com/josue-lubaki" target="_blank" rel="noopener noreferrer"><li>GitHub</li></a>
            </ul>
            </div>
        </body>
    </html>
    `)
})

// connexion de la base des données
database
    .connexionDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Welcome : http://localhost:3000/')
        })
    })
    .catch((err) => {
        console.log(err)
    })

// Routers
const categoriesRoutes = require('./src/routes/categories')
const productsRoutes = require('./src/routes/products')
const usersRoutes = require('./src/routes/users')
const ordersRoutes = require('./src/routes/orders')
const reservationRoutes = require('./src/routes/reservation')
const bannersRoutes = require('./src/routes/bannersRoutes')
const api = process.env.API_URL

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)
app.use(`${api}/reservations`, reservationRoutes)
app.use(`${api}/banners`, bannersRoutes)
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

module.exports = app
