process.env.NODE_ENV = 'test'
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../app')
const database = require('../../../db/database')
const api = process.env.API_URL
const authJwt = require('../../../helpers/jwt')

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

    it('OK, deleting a Categorie works', (done) => {
        request(app)
            .get(`${api}/categories/`)
            .then((res) => {
                const body = res.body
                request(app)
                    .delete(`${api}/categories/${body.pop()._id}`, authJwt)
                    .then((res) => {
                        expect(res.body.length).to.equal(0)
                        done()
                    })
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
