process.env.NODE_ENV = 'test'
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../app')
const database = require('../../../db/database')
const api = process.env.API_URL
const authJwt = require('../../../helpers/jwt')

/**
 * Test Unitaire au moment de la creation d'une categorie
 */
describe('POST /categories', () => {
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

    it('OK, creating a new Categorie works', (done) => {
        request(app)
            .post(`${api}/categories/`, authJwt)
            .send({
                name: 'Categorie test',
                icon: 'icon test',
                color: 'color test',
            })
            .then((res) => {
                const body = res.body
                expect(body).that.includes.all.keys([
                    '_id',
                    'name',
                    'icon',
                    'color',
                ])
                expect(200, done)
                done()
            })
            .catch((err) => done(err))
    })
})
