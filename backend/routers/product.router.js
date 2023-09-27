const express = require('express');
const schema = require('../utils/joi');
const controller = require('../controllers/productController');
const router = express.Router();
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
}).array('productImages',10)

router.post('/product', schema.validate,upload, controller.addProduct);

router.get('/product', controller.showProduct);

router.post('/product/all', controller.showAllProduct);

router.post('/product/update',upload,controller.editProduct);

router.post('/product/delete', controller.deleteProduct);

module.exports = router;