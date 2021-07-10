const mongoose = require('mongoose')
require('dotenv').config()

function connexionDB() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose
            const mockgoose = new Mockgoose(mongoose)

            mockgoose.prepareStorage().then(() => {
                mongoose
                    .connect(process.env.CONNECTION_STRING, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useFindAndModify: false,
                        dbName: process.env.DB_NAME,
                    })
                    .then((res, err) => {
                        if (err) return reject(err)
                        resolve()
                    })
            })
        } else {
            mongoose
                .connect(process.env.CONNECTION_STRING, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    dbName: process.env.DB_NAME,
                })
                .then((res, err) => {
                    if (err) return reject(err)
                    resolve()
                })
        }
    })
}

function close() {
    return mongoose.disconnect()
}

module.exports = { connexionDB, close }
