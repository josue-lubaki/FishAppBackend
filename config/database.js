const mongoose = require('mongoose')
require('dotenv').config()

const connexionDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            dbName: process.env.DB_NAME,
        })

        console.log(`MongoDB connected : ${conn.connection.host}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connexionDB
