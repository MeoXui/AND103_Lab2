var express = require('express')
var router = express.Router()

const Distributor = require('../models/distributors')
const Fruit = require('../models/fruits')
const User = require('../models/users')

router.post('/add_distributor', async (req, res) => {
    try{
        const data = req.body;
        const anew = new Distributor({name: data.name});
        const result = await anew.save();
        if(result) res.json({
            "status": 200,
            "messenger": "Da them distributor",
            "data": result
        }); else res.json({
            "status": 400,
            "messenger": "Them distributor that bai",
            "data": []
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/add_fruit', async (req, res) => {
    try{
        const data = req.body;
        const anew = new Fruit({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = await anew.save();
        if(result) res.json({
            "status": 200,
            "messenger": "Da them fruit",
            "data": result
        }); else res.json({
            "status": 400,
            "messenger": "Them fruit that bai",
            "data": []
        });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router