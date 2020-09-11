'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ArtistSchema = Schema({
    name: String,
    description: String,
    image: String,
    style: String
})

module.exports = mongoose.model('Artist', ArtistSchema)