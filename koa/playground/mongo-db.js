const mongoose = require('mongoose')

const config = require('./config').mongo

mongoose.connect(config.uri, config.options)
mongoose.connection.on('connected', () => console.log('Mongoose connected to ' + config.uri))

mongoose.connection.on('error', err => console.log('Mongoose connection error: ' + err))

mongoose.connection.on('disconnected', () => console.log('Mongoose connection disconnected'))