var express = require('express')
var router = express.Router()

const Distributor = require('../models/distributors')
const Fruit = require('../models/fruits')
const User = require('../models/users')

router.post('/add_distributor', async (req, res) => {
    try {
        const data = req.body;
        const anew = new Distributor({ name: data.name });
        const result = await anew.save();
        if (result) res.json({
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
    try {
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
        if (result) res.json({
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

router.get('/list_fruit', async (req, res) => {
    try {
        const data = await Fruit.find().populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/fruit_by_id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Fruit.findById(id).populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/list_fruit_in_price', async (req, res) => {
    try {
        const { ps, pe } = req.query;
        const query = { price: { $gte: ps, $lte: pe } };
        const data = await Fruit.find(query, 'name quantity price id_distributor')
            .populate(id_distributor)
            .sort({ quantity: -1 })
            .skip(0)
            .limit(2);
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/list_fruit_have_name_a_or_x', async (req, res) => {
    try {
        const query = {
            $or: [
                { name: { $regex: 'T' } },
                { name: { $regex: 'X' } }
            ]
        };
        const data = await Fruit.find(query, 'name quantity price id_distributor')
            .populate(id_distributor);
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
})

router.put('/update_fruit_by_id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const update = await Fruit.findById(id);
        let result = null;
        if (update) {
            update.name = data.name ?? update.name;
            update.quantity = data.quantity ?? update.quantity;
            update.price = data.price ?? update.price;
            update.status = data.status ?? update.status;
            update.image = data.image ?? update.image;
            update.description = data.description ?? update.description;
            update.id_distributor = data.id_distributor ?? update.id_distributor;
            result = await update.save();
        }
        
        if (result) res.json({
            "status": 200,
            "messenger": "Da cap nhat fruit",
            "data": result
        }); else res.json({
            "status": 400,
            "messenger": "Cap nhat fruit that bai",
            "data": []
        });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router