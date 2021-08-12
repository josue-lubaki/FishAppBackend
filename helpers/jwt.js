const expressJwt = require('express-jwt')
const tokenName = process.env.token

function authJwt() {
    const secret = process.env.secret
    const api = process.env.API_URL
    if (process.env.NODE_ENV === 'test') {
        return expressJwt({
            secret,
            algorithms: ['HS256'],
            isRevoked: isRevoked,
        }).unless({
            path: [{ url: /(.*)/ }],
        })
    } else {
        return expressJwt({
            secret,
            algorithms: ['HS256'],
            isRevoked: isRevoked,
        }).unless({
            path: [
                { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
                { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
                {
                    url: /\/api\/v1\/categories(.*)/,
                    methods: ['GET', 'OPTIONS'],
                },
                {
                    url: /\/api\/v1\/orders\/get\/userorder\/(.*)/,
                    methods: ['GET', 'OPTIONS'],
                },
                {
                    url: /\/api\/v1\/reservations(.*)/,
                    methods: ['GET', 'OPTIONS'],
                },
                { url: /\/api\/v1\/banners(.*)/, methods: ['GET', 'OPTIONS'] },
                { url: /\/api\/v1\/users(.*)/, methods: ['GET', 'OPTIONS'] },
                `${api}/users/login`,
                `${api}/users/register`,
                {
                    url: /\/api\/v1\/orders(.*)/,
                    methods: ['GET', 'OPTIONS'],
                },
                {
                    url: /\/api\/v1\/orders(.*)/,
                    methods: ['POST', 'OPTIONS'],
                },
                // {
                //     url: /\/api\/v1\/users\/compte\/forgot\/(.*)/,
                // },
            ],
        })
    }
}

/**
 * Methode qui permet de bloquer les autres actions (POST, DELETE, UPDATE) pour les Utilisateurs ayant un token dont
 * le champ "isAdmin" serait false. À présent, que les Utilisateurs étant admin:true peuvent (POST, DELETE, UPDATE)
 * @param {*} req
 * @param {*} payload  type de retour (ex: DATA)
 * @param {*} done(callback, reject)
 */
async function isRevoked(req, payload, done) {
    console.log('Request ', req)
    if (!payload.isAdmin) {
        done(null, true)
    } else if (req.url.includes('orders')) {
    }

    done()
}

module.exports = authJwt
