'use strict'

let jwt = require('jwt-simple')
let moment = require('moment')
let secret = 'key_mean'
let payload

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'Request doesnt contain authorization header'})
    }

    let token = req.headers.authorization.replace(/['"]+/g, '')
    try {
        payload = jwt.decode(token, secret)

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'Token has expired'})
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: 'Token is not valid'})
    }

    req.user = payload

    next()
}