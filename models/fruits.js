const mongoose = require('mongoose')
const scheme = mongoose.Schema

const fruit = new scheme({
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    status: { type: Number },
    image: { type: Array },
    description: { type: Number },
    id_distributor: { type: scheme.Types.ObjectId, ref: "distributor" }
}, { timestamps: true })

module.exports = mongoose.model('fruit', fruit);