'use strict'

let express = require('express')
let UserController = require('./../controllers/user')

let md_auth = require('./../middlewares/authenticated')

let multipart = require('connect-multiparty')
let md_upload = multipart({ uploadDir: './uploads/users' })

let api = express.Router()

api.get('/test', md_auth.ensureAuth, UserController.test)
api.post('/register', UserController.saveUser)
api.post('/login', UserController.login)
api.put('/update/:id', md_auth.ensureAuth, UserController.updateUser)
api.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage)
api.get('/get-image/:imageFile', UserController.getImageFile)
api.get('/users', md_auth.ensureAuth, UserController.getUsers)
api.delete('/delete/:id', md_auth.ensureAuth, UserController.deleteUser)
api.get('/users/:id', md_auth.ensureAuth, UserController.getUser)

module.exports = api