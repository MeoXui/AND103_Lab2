var express = require('express')
const JWT = require('jsonwebtoken')
var router = express.Router()
const SECRETKEY = "MATKHAUBIMATSIEUCAPVUTRU"

const Distributor = require('../models/distributors')
const Fruit = require('../models/fruits')
const User = require('../models/users')

const image = require('../config/common/image')
const Transporter = require('../config/common/mail')

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

router.post('/add_fruit_with_image', image.array('image', 5), async (req, res) => {
    try {
        const data = req.body;
        const { files } = req;
        const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/images/${file.filename}`);
        const anew = new Fruit({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage,
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

router.post('/register', image.single('avatar'), async (req, res) => {
    try {
        const data = req.body;
        const { files } = req;
        const anew = new User({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avatar: `${req.protocol}://${req.get("host")}/images/${file.filename}`
        })
        const result = await anew.save();
        if (result) {
            const options = {
                from: "huynkph38086@fpt.edu.vn",
                to: result.email,
                subject: "Đăng ký thành công",
                text: "Cảm ơn bạn đã đăng ký"
            };
            await Transporter.sendMail(options);
            res.json({
                "status": 200,
                "messenger": "Dang ky thanh cong",
                "data": result
            });
        } else res.json({
            "status": 400,
            "messenger": "Dang ky that bai",
            "data": []
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (user) {
            const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1h' });
            const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1d' })
            res.json({
                "status": 200,
                "messenger": "Dang nhap thanh cong",
                "data": user,
                "token": token,
                "refreshToken": refreshToken
            })
        } else res.json({
            "status": 400,
            "messenger": "Dang nhap that bai",
            "data": []
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/list_distributor', async (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    let payload;
    JWT.verify(token, SECRETKEY, (err, _payload) => {
        if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
        if (err) return res.sendStatus(403);
        payload = _payload;
    });
    console.log(payload);

    try {
        const data = await Distributor.find().sort({ createdAt: -1 });
        res.json({
            "status": 200,
            "messenger": "Danh sach distributor",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/search_distributor', async (req, res) => {
    try {
        const key = req.query.key;
        const data = await Distributor.find({
            name: { "$regex": key, "$options": "i" }
        }).sort({ createdAt: -1 });
        res.json({
            "status": 200,
            "messenger": "Danh sach tim kiem distributor",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/list_fruit', async (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    let payload;
    JWT.verify(token, SECRETKEY, (err, _payload) => {
        if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
        if (err) return res.sendStatus(403);
        payload = _payload;
    });
    console.log(payload);

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

router.put('/update_distributor_by_id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await Distributor.findByIdAndUpdate(id, {name: data.name});
        if (result) res.json({
            "status": 200,
            "messenger": "Da cap nhat distributor",
            "data": result
        }); else res.json({
            "status": 400,
            "messenger": "Cap nhat distributor that bai",
            "data": []
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

router.delete('/delete_distributor_by_id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = Distributor.findByIdAndDelete(id);
        if (result) res.json({
            "status": 200,
            "messenger": "Da xoa distributor",
            "data": result
        }); else res.json({
            "status": 400,
            "messenger": "Xoa distributor that bai",
            "data": []
        });
    } catch (error) {
        console.log(error);
    }
})

router.delete('/delete_fruit_by_id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = Fruit.findByIdAndDelete(id);
        if (result) res.json({
            "status": 200,
            "messenger": "Da xoa fruit",
            "data": result
        }); else res.json({
            "status": 400,
            "messenger": "Xoa fruit that bai",
            "data": []
        });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router