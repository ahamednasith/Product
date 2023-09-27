const db = require('../models/index');
const { Sequelize, Op, json } = require('sequelize');
const Product = db.product;


const addProduct = async (req, res) => {
  try {
    const images = req.files;
    const productInfo = req.body.products;
    const productID = Math.floor(100000 + Math.random() * 900000);
    const product =  productInfo.map((input, index) => ({
      productID,
      rate: input.rate,
      discount: input.discount,
      price: input.price,
      image: images[index].filename, 
    }))
    const sellingPrice = await Product.bulkCreate(product);
    const count = await Product.count({ where: [{ productID }] });
    if (count) {
      const newProducts = await Product.update({ count }, { where: { productID } });
    }
    return res.status(200).json({ statuscode: 200, message: "success", count, productID })
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message });
  }
}



const showProduct = async (req, res) => {
  try {
    const product = await Product.findAll();
    const ProductID = new Set();
    const productData = product
      .filter(product => {
        if (!ProductID.has(product.productID)) {
          ProductID.add(product.productID);
          return true;
        }
        return false;
      })
      .map(products => ({
        productID: products.productID,
        id: products.id,
        rate: products.rate,
        discount: products.discount,
        price: products.price,
        count: products.count,
        image:products.image
      }));
    return res.status(200).json({ statuscode: 200, productData })
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message })
  }
}



const showAllProduct = async (req, res) => {
  try {
    const productID = req.body.productID;
    const products = await Product.findAll({
      where: {
        productID
      }
    });
    const productData = products.map(product => ({
      id: product.id,
      productID: product.productID,
      rate: product.rate,
      discount: product.discount,
      price: product.price,
      image:`http://localhost:3000/public/images/${product.image}`
    }));
    return res.status(200).json({ statuscode: 200, productData });
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message });
  }
};




const editProduct = async (req, res) => {
  try {
    const productInfo = req.body.products;
    const images = req.files;
    const productID = productInfo.map(item => item.productID);
    const providedIds = productInfo.map(item => item.id || 0);
    const givenID = [];
    for (index =0; index < productInfo.length; index++ ) {
      const item = productInfo[index];
      const id = item.id;
      const productID = item.productID;
      const rate = item.rate;
      const discount = item.discount;
      const price = item.price;
      const image = images[index].filename
      const product = await Product.count({ where: { productID, id } });
      if (product === 0) {
        const newProduct = await Product.create({ productID, rate, discount, price,image });
        if (newProduct) {
          givenID.push(newProduct.id);
        }
        const count = await Product.count({ where: { productID } });
        if (count) {
          const newProducts = await Product.update({ count }, { where: { productID } });
        }
      } else {
        const updateProduct = await Product.update({ rate, discount, price,image }, { where: { id } });
      }
    }
    const IDs = givenID.concat(providedIds);
    const removeProducts = await Product.destroy({ where: { productID, id: { [Sequelize.Op.notIn]: IDs } } })
    if (removeProducts) {
      const count = await Product.count({ where: { productID } });
      if (count) {
        const newProducts = await Product.update({ count }, { where: { productID } });
      }
    }
    return res.status(200).json({ statuscode: 200, message: "Updated", removeProducts });
  } catch (error) {
    return res.status(500).json({ statuscode: 500, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productInfo = req.body;
    const productID = productInfo.map(item => item.productID);
    const remove = await Product.destroy({ where: { productId: productID } })
      ; return res.status(200).json({ statuscode: 200, message: "deleted" })
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message })
  }
}




module.exports = { addProduct, showAllProduct, showProduct, editProduct, deleteProduct };