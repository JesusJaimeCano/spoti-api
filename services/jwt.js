'use strict'

let jwt = require('jwt-simple')

// Moment is used to create a date for the token, and expiration for it
let moment = require('moment')

let secret = 'key_mean'

// The user that this function will recive, is for encode in the jwt
exports.createToken = (user) => {
    let payload = {
        sub: user._id,  // Save id register in the database
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret)
}