const expressJwt = require('express-jwt')
const tokenName = process.env.token

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
            isRevoked: isRevoked,
        }).unless({
            path: [
                { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
                { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
                {
                    url: /\/api\/v1\/categories(.*)/,
                    methods: ['GET', 'OPTIONS'],
                },
                { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS'] },
                `${api}/users/login`,
                `${api}/users/register`,
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
    if (!payload.isAdmin) {
        done(null, true)
    }

    done()
}

/**
 * Methode qui permet de bloquer toutes les routes sauf pour un user authentifié
 * @param {*} req
 * @param {*} res
 * @param {*} done
 */
// async function verifyToken(req, res, done) {
//     const bearerToken = req.headers[tokenName]
//     if (typeof bearerToken !== 'undefined') {
//         req.token = bearerToken
//         done()
//     } else if (req.url.includes('orders')) {
//     }

//     done(null, true)
// }

module.exports = authJwt