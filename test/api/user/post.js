process.env.NODE_ENV = 'test'
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../app')
const database = require('../../../db/database')
const api = process.env.API_URL

/**
 * Test Unitaire au moment de la creation d'une categorie
 */
describe('POST /users', () => {
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

    it('OK, creating a new users works', (done) => {
        request(app)
            .post(`${api}/users/`)
            .send({
                name: 'user test',
                isAdmin: 'false',
                avenue: 'avenue test',
                apartment: '2',
                quartier: 'quartier test',
                commune: 'commune test',
                city: 'city test',
                email: 'email test',
                password: 'passwordHash',
                phone: 'phone',
            })
            .then((res) => {
                const body = res.body
                expect(body).that.includes.all.keys([
                    '_id',
                    'name',
                    'isAdmin',
                    'avenue',
                    'apartment',
                    'quartier',
                    'commune',
                    'city',
                    'email',
                    'passwordHash',
                    'phone',
                ])
                expect(200, done)
                done()
            })
            .catch((err) => done(err))
    })
})
