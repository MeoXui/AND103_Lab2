const mongoose = require('mongoose')
const scheme = mongoose.Schema

const distributor = new scheme({
    name: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('distributor', distributor);