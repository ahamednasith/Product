const Joi = require('joi');

const schema = Joi.object({
    productID: Joi.number().min(100000).max(999999),
    rate: Joi.number(),
    discount: Joi.number(),
    price: Joi.number()
});

const validate = (req, res, next) => {
    const productID = Math.floor(100000 + Math.random() * 900000);
    const rate = req.body.rate;
    const discount = req.body.discount;
    const price = req.body.price;
    const { error } = schema.validate({ productID, rate, discount, price });
    if (error) {
        return res.status(401).json({ statuscode: 401, error: error.message })
    }
    next();
};

module.exports = { validate };
