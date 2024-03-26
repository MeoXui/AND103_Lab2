const multer = require("multer");

const _storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + file.originalname)
    }
})

const image = multer({ storage: _storage })
module.exports = image