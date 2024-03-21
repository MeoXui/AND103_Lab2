const mongoose = require('mongoose')
const scheme = mongoose.Schema

const user = new scheme({
    username: {type: String, unique: true, maxLenght: 255},
    password: {type: String, maxLenght: 255},
    email: {type: String, unique: true},
    name: {type: String},
    avatar: {type: String},
    avaiable: {type: Boolean, default: false}
},{timestamps: true})

module.exports = mongoose.model('user', user);