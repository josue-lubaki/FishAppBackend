process.env.NODE_ENV = 'test'
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../app')
const database = require('../../../db/database')
const api = process.env.API_URL

describe('GET /products', () => {
    before((done) => {
        database
            .connexionDB()
            .then(() => done())
            .catch((err) => done(err))
    })

    after((done) => {
        database
            .close()
            .then(() => done())
            .catch((err) => done(err))
    })

    it('OK, getting products', (done) => {
        request(app)
            .get(`${api}/products/`)
            .then((res) => {
                const body = res.body
                expect(body.length).to.equal(0)
                done()
            })
            .catch((err) => done(err))
    })
})
