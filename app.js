'use strict'

let express = require('express')
let bodyParser = require('body-parser')


let app = express()

// Load Routes
let user_routes = require('./routes/user')
let artist_routes = require('./routes/artist')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Custom Headers

// Load BaseRoutes
app.use('/api', user_routes)
app.use('/api', artist_routes)


// TEST
// app.get('/test-api', (req, resp) => {
//     resp.status(200).send({message: "Welcome to a new video about how to build an api rest using nodejs"})
// })

module.exports = app;