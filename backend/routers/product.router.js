const express = require('express');
const schema = require('../utils/joi');
const controller = require('../controllers/productController');
const router = express.Router();

router.post('/product', schema.validate, controller.addProduct);

router.get('/product', controller.showProduct);

router.post('/product/all', controller.showAllProduct);

router.post('/product/update', controller.editProduct);

module.exports = router;