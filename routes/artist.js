'use strict'

let express = require('express')
let ArtistController = require('./../controllers/artist')

let md_auth = require('./../middlewares/authenticated')
let multipart = require('connect-multiparty')
let md_upload = multipart({ uploadDir: './uploads/artists' })

let api = express.Router()

api.post('/artists', md_auth.ensureAuth, ArtistController.saveArtist)
api.get('/artists/:id', md_auth.ensureAuth, ArtistController.getArtist)
api.put('/artists/:id', md_auth.ensureAuth, ArtistController.updateArtist)
api.get('/artists', md_auth.ensureAuth, ArtistController.getArtist)
api.delete('/artists/:id', md_auth.ensureAuth, ArtistController.deleteArtist)
api.post('/artists/:id/image', [md_auth.ensureAuth, md_upload], ArtistController.uploadArtistImage)
api.get('/artists/:imageFile/image', ArtistController.getImageFile)

module.exports = api