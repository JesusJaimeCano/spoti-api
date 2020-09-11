'use strict'

let User = require('./../models/user')
let bcrypt = require('bcrypt-nodejs')
let jwt = require('./../services/jwt')
let fs = require('fs')
let path = require('path')


let test = (req, res) => {
    res.status(200).send({
        message: 'Testing controller action for user'
    });
}

let getUsers = (req, res) => {
    User.find((err, users) => {
        res.status(200).send({ users: users })
    })
}

let getUser = (req, res) => {
    let userId = req.params.id

    if (!userId) {
        res.status(400).send({ message: 'Give me an userId, asshole' })
    } else {
        User.findById(userId, (err, user) => {
            if (err) {
                res.status(500).send({ message: 'There was a problem trying to get the user' })
            } else {
                res.status(200).send({ user })
            }
        })
    }
}

let deleteUser = (req, res) => {
    let userId = req.params.id

    if (!userId) {
        res.status(400).send({ message: 'Give me an userId, asshole' })
    } else {
        User.deleteOne({_id: userId}, (err) => {
            if (err) {
                console.log(err);
                
                res.status(500).send({ message: 'User cannot be delete' })
            } else {
                res.status(200).send({ message: `User with id => ${userId} was deleted` })
            }
        })
    }
}

let saveUser = (req, res) => {
    let user = new User()
    let params = req.body;

    user.name = params.name
    user.lastName = params.lastName
    user.email = params.email
    user.role = 'ROLE_ADMIN'
    user.image = null


    if (params.password) {
        //Encrypt password
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash

            if (user.name && user.lastName && user.email) {
                // Save user
                user.save((err, userSaved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error while trying to save user' })
                    } else {
                        if (!userSaved) {
                            res.status(404).send({ message: 'Error while trying to save user' })
                        } else {
                            res.status(200).send({ user: userSaved })
                        }
                    }
                })
            } else {
                res.status(400).send({ message: 'You forgot some params' })
            }
        })

    } else {
        res.status(400).send({ message: 'You forgot password' })
    }
}


let login = (req, res) => {

    let params = req.body

    let email = params.email
    let password = params.password

    if (email && password) {
        User.findOne({
            email: email.toLowerCase()
        }, (err, user) => {
            if (err) {
                res.status(500).send({ message: 'Error with the req' })
            } else {
                if (!user) {
                    res.status(400).send({ message: 'User doesnt exist' })
                } else {

                    // Compare passwords
                    bcrypt.compare(password, user.password, (err, check) => {
                        if (check) {
                            // return user loged
                            if (params.getHash) {
                                // return JWT
                                res.status(200).send({
                                    token: jwt.createToken(user)
                                })
                            } else {
                                res.status(200).send({ user })
                            }
                        } else {
                            res.status(400).send({ message: 'Error with your credentials' })
                        }
                    })
                }
            }
        })
    } else {
        res.status(400).send({ message: 'You forgot enter credentials' })
    }
}

let updateUser = (req, res) => {
    var userId = req.params.id // We got params from URL
    var update = req.body // We Got Body from request object

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error while trying update user' })
        } else {
            if (!userUpdated) {
                res.status(500).send({ message: 'User not updated' })
            } else {
                res.status(200).send({ user: userUpdated })
            }
        }
    })
}

let uploadImage = (req, res) => {
    let userId = req.params.id
    let file_name = 'No image to upload...'

    if (req.files) {
        
        let file_path = req.files.image.path
        let file_split = file_path.split('/')
        file_name = file_split[2]
        let ext_split = file_name.split('.')
        let file_ext = ext_split[1]

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == "jpeg") {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                console.log(err);
                if (err) {
                    res.status(500).send({ message: 'User not updated' })
                } else {
                    if (!userUpdated) {
                        res.status(500).send({ message: 'User not updated' })
                    } else {
                        res.status(200).send({ user: userUpdated,
                        file_name: file_name })
                    }
                }
            })
        } else {
            res.status(400).send({ message: 'Pick an image with a valid extension ( png, jpg, jpeg and gif )' })
        }
    } else {
        res.status(500).send({ message: 'Image no uploaded' })
    }

}

let getImageFile = (req, res) => {
    let imageFileName = req.params.imageFile
    let pathFile = './uploads/users/' + imageFileName
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile))
        } else {
            res.status(404).send({ message: 'image doesn exists' })
        }
    })
}


module.exports = {
    test,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getUsers,
    deleteUser,
    getImageFile,
    getUser
}