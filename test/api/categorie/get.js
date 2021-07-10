process.env.NODE_ENV = 'test'
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../app')
const database = require('../../../db/database')
const api = process.env.API_URL

describe('GET /categories', () => {
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

    it('OK, getting categories has no categorie', (done) => {
        request(app)
            .get(`${api}/categories/`)
            .then((res) => {
                const body = res.body
                expect(body.length).to.equal(0)
                done()
            })
            .catch((err) => done(err))
    })

    it('OK, getting categories has 1 categorie', (done) => {
        request(app)
            .post(`${api}/categories/`)
            .send({
                name: 'Categorie test',
                icon: 'icon test',
                color: 'color test',
            })
            .then((res) => {
                request(app)
                    .get(`${api}/categories/`)
                    .then((res) => {
                        const body = res.body
                        expect(body.length).to.equal(1)
                        done()
                    })
            })
            .catch((err) => done(err))
    })
})
