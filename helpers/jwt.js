const expressJwt = require('express-jwt')

function authJwt() {
    const secret = process.env.secret
    const api = process.env.API_URL
    if (process.env.NODE_ENV === 'test') {
        return expressJwt({
            secret,
            algorithms: ['HS256'],
            isRevoked: verifyToken,
        }).unless({
            path: [{ url: /(.*)/ }],
        })
    } else {
        return expressJwt({
            secret,
            algorithms: ['HS256'],
            isRevoked: verifyToken,
        }).unless({
            path: [
                { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
                { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
                {
                    url: /\/api\/v1\/categories(.*)/,
                    methods: ['GET', 'OPTIONS'],
                },
                { url: /\/api\/v1\/orders(.*)/, methods: ['POST', 'OPTIONS'] },
                `${api}/users/login`,
                `${api}/users/register`,
            ],
        })
    }
}

/**
 * Methode qui permet de bloquer toutes les routes sauf pour un user authentifié
 * @param {*} req
 * @param {*} res
 * @param {*} done
 */
async function verifyToken(req, res, done) {
    const bearerToken = req.headers['user_token']
    if (typeof bearerToken !== 'undefined') {
        req.token = bearerToken
        done()
    } else if (req.url.includes('orders')) {
    }

    done(null, true)
}

module.exports = authJwt
