'use strict'

let Artist = require('./../models/artist')
let Album = require('./../models/album')
let Song = require('./../models/song')

let mongoosePagination = require('mongoose-pagination')

let fs = require('fs')
let path = require('path')

let getArtist = (req, res) => {
    let artistId = req.params.id

    // Options per pagination
    let page = Number(req.query.page)
    let itemsPerPage = Number(req.query.itemsPerPage)

    if (!artistId) {

        if (page && itemsPerPage) {

            Artist.find().paginate(page, itemsPerPage, (err, artists, totalItems) => {

                if (err) {
                    res.status(500).send({ message: 'Error traying to get artists list' })

                } else {
                    if (!artists) {
                        res.status(404).send({ message: 'There is no artist saved' })
                    } else {
                        res.status(200).send({
                            pages: totalItems,
                            artists: artists
                        })
                    }
                }
            })
        } else {
            Artist.find((err, artists) => {
                if (err) {
                    res.status(500).send({ message: 'Error traying to get artists list' })
                } else {
                    if (!artists) {
                        res.status(404).send({ message: 'There is no artist saved' })
                    } else {
                        res.status(200).send(artists)
                    }
                }
            })
        }
    } else {
        Artist.findById(artistId, (err, user) => {
            if (err) {
                res.status(500).send({ message: 'Error traying to get artist' })
            } else {
                res.status(200).send({ user })
            }
        })
    }
}

let saveArtist = (req, res) => {

    let artist = new Artist()
    let params = req.body
    artist.name = params.name
    artist.description = params.description
    artist.image = null
    artist.style = params.style

    if (artist.name && artist.description && artist.style) {
        artist.save((err, artistSaved) => {
            if (err) {
                res.status(500).send({ message: 'Error while trying to save artist' })
            } else {
                if (!artistSaved) {
                    res.status(500).send({ message: 'Error while trying to save artist' })
                } else {
                    res.status(200).send({ artist: artistSaved })
                }
            }
        })
    } else {
        res.status(400).send({ message: 'You are missing some fields' })
    }

}

let updateArtist = (req, res) => {
    let artistId = req.params.id
    let update = req.body
    if (artistId) {
        if (update.name || update.description || update.style) {
            Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error while trying to update artist' })
                } else {
                    if (!artistUpdated) {
                        res.status(500).send({ message: 'Error while trying to update artist' })
                    } else {
                        res.status(201).send({ artist: artistUpdated })
                    }
                }
            })
        } else {
            res.status(400).send({ message: 'There is nothing to update, send the params for update this user' })
        }
    } else {
        res.status(400).send({ message: 'There is nothing to update, send the id for update this user' })
    }
}

let deleteArtist = (req, res) => {
    let artistID = req.params.id

    if (!artistID) {
        res.status(400).send({ message: 'You missing the id' })
    } else {
        Artist.findByIdAndDelete(artistID, (err, artistDeleted) => {
            if (err) {
                res.status(500).send({ message: 'Error deleting the artist' })
            } else {
                if (!artistDeleted) {
                    res.status(204).send({ message: 'There is no artist to removed' })
                } else {

                    Album.find({ artist: artistDeleted.id }).remove((err, albumRemoved) => {
                        if (err) {
                            res.status(500).send({ message: 'Error deleting the album' })
                        } else {
                            if (!albumRemoved) {
                                res.status(204).send({ message: 'There are not albums to delete' })
                            } else {
                                Song.find({ album: albumRemoved.id }).remove((err, songRemoved) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Error deleting the song' })
                                    } else {
                                        if (!songRemoved) {
                                            res.status(204).send({ message: 'There are not songs to delete' })
                                        } else {
                                            res.status(200).send({ message: 'Songs Removed' })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }

            }
        })
    }
}

let uploadArtistImage = (req, res) => {
    let artistId = req.params.id
    let file_name = 'No image to Upload'

    if (req.files) {

        let file_path = req.files.image.path
        let file_split = file_path.split('/')
        file_name = file_split[2]
        let ext_split = file_name.split('.')
        let file_ext = ext_split[1]

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == "jpeg") {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistImageUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Artist image not updated' })
                } else {
                    if (!artistImageUpdated) {
                        res.status(500).send({ message: 'Artist image not updated' })
                    } else {
                        res.status(200).send({ artist: artistImageUpdated })
                    }
                }
            })
        } else {
            res.status(400).send({ message: 'Pick an image with a valid extension ( png, jpg, jpeg and gif )' })
        }

    } else {
        res.status(400).send({ message: 'You forgot to load the image'})
    }
}

let getImageFile = (req, res) => {
    let imageFileName = req.params.imageFile
    let pathFile = './uploads/artists/' + imageFileName
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile))
        } else {
            res.status(404).send({ message: 'image doesn exists' })
        }
    })
}


module.exports = {
    saveArtist,
    updateArtist,
    getArtist,
    deleteArtist,
    uploadArtistImage,
    getImageFile
}