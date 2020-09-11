'use strict'

let mongoose = require('mongoose')
let app = require('./app')
let port = process.env.PORT || 3977

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/mean', { useNewUrlParser: true, useUnifiedTopology: true }, (err, rest) => {
    if (err) {
        throw err;
    } else {
        console.log('Data base is running correctly, go for it...')

        app.listen(port, () => {
            console.log('Music API Rest Listening on port => ', port);
        })
    }
})
