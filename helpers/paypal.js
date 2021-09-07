const paypal = require('paypal-rest-sdk')

paypal.configure({
    mode: 'sandbox', //sandbox or live
    client_id: '####yourclientid######',
    client_secret: '####yourclientsecret#####',
})
