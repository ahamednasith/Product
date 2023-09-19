const db = require('../models/index');
const { Sequelize, Op, json } = require('sequelize');
const Product = db.product;

const addProduct = async (req, res) => {
  try {
    const productInfo = req.body;
    let productId = null;
    if (productInfo[0].productID){
      const productID = productInfo.map((input) => input.productID)
      const product = productInfo.map((input) => ({
        productID:input.productID,
        rate: input.rate,
        discount: input.discount,
        price: input.price,
      }));
      const sellingPrice = await Product.bulkCreate(product);
      const count = await Product.count({ where: { productID } });
      if (count) {
      const newProducts = await Product.update({ count }, { where: { productID } });
      return res.status(200).json({ statuscode: 200, message: "success", count, productID })
    }
    } else {
      const newProductId = Math.floor(100000 + Math.random() * 900000);
      const product = productInfo.map((input) => ({
        productID:newProductId,
        rate: input.rate,
        discount: input.discount,
        price: input.price,
      }));
      const sellingPrice = await Product.bulkCreate(product);
      if(sellingPrice){
        const productID = product.map((input)=>input.productID); 
        const count = await Product.count({ where: [{ productID}] });
        if (count) {
        const newProducts = await Product.update({ count }, { where: { productID} });
      }
      return res.status(200).json({ statuscode: 200, message: "success", count, productID})
    }
  }
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message });
  }
};
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
        id:products.id,
        rate:products.rate,
        discount:products.discount,
        price:products.price,
        count: products.count
      }));
    return res.status(200).json({statuscode: 200,productData})
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
      price: product.price
    }));
    return res.status(200).json({ statuscode: 200, productData });
  } catch (error) {
    return res.status(500).json({statuscode: 500, error: error.message});
  }
};

const editProduct = async (req, res) => {
  try {
    const productID = req.body.productID;
    const product = await Product.findAll({ where:{productID}});
    const productData = product.map(product => ({
      id: product.id,
      productID: product.productID,
      rate: product.rate,
      discount: product.discount,
      price: product.price
    }));
    if (productData){
      const id = req.body.id;
      const products = await Product.update({
      rate: req.body.rate,
      discount: req.body.discount,
      price: req.body.price
    }, { where: { id } })
    return res.status(200).json({statuscode:200,message:"updated",products})
    }
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error:error.message })
  }
}
const deleteProduct = async (req,res) =>{
  try {
    const productID = req.body.productID;
    const product = await Product.findAll({ where:{productID}});
    if (product){
      const id = req.body.id;
      const products = await Product.destroy({ where: { id } })
      if(products){
        const count = await Product.count({ where: { productID } });
        if (count) {
        const newProducts = await Product.update({ count }, { where: { productID } });
        }
      }
    return res.status(200).json({statuscode:200,message:"updated",products})
    }
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error:error.message })
  }
}

module.exports = { addProduct, showAllProduct, showProduct,editProduct,deleteProduct};