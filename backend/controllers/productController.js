const db = require('../models/index');
const { Sequelize, Op } = require('sequelize');
const Product = db.product;
const Section = db.section;


const addProduct = async (req, res) => {
  try {
    const images = req.files;
    const productInfo = req.body.products;
    const productID = Math.floor(100000 + Math.random() * 900000);
    const product = productInfo.map((input, index) => ({
      productID,
      rate: input.rate,
      discount: input.discount,
      price: input.price,
      image: images[index] ? images[index].filename : "",
    }))
    const sellingPrice = await Product.bulkCreate(product);
    if (sellingPrice) {
      const productSizes = productInfo.forEach(async (products, index) => {
        const sectionID = sellingPrice[index].id;
        const productDetails = products.productSizes.map((item) => ({
          productID,
          sectionID,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        }));
        const section = await Section.bulkCreate(productDetails);
      });
    }
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
        count: products.count,
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
    const sectionID = products.map((Id) => Id.id);
    const sections = await Section.findAll({
      where: {
        sectionID
      }
    });

    const sectionData = {};
    sections.forEach(section => {
      const sectionID = section.sectionID;
      if (!sectionData[sectionID]) {
        sectionData[sectionID] = [];
      }
      sectionData[sectionID].push({
        id:section.id,
        sectionID:section.sectionID,
        size: section.size,
        quantity: section.quantity,
        price: section.price
      });
    });
    const image = products.map((product) => ({
      image: product.image
    }))
    if (image[0].image === '') {
      const productData = products.map(product => {
        const sectionInfo = sectionData[product.id];
        return {
          id: product.id,
          productID: product.productID,
          rate: product.rate,
          discount: product.discount,
          price: product.price,
          productSizes: sectionInfo
        };
      });
      return res.status(200).json({ statuscode: 200, productData, image });
    } else {
      const productData = products.map(product => {
        const sectionInfo = sectionData[product.id];
        return {
          id: product.id,
          productID: product.productID,
          rate: product.rate,
          discount: product.discount,
          price: product.price,
          productSizes: sectionInfo,
          image: `http://localhost:3000/public/images/${product.image}`,
        };
      });
      return res.status(200).json({ statuscode: 200, productData, image, });
    }
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
    for (index = 0; index < productInfo.length; index++) {
      const item = productInfo[index];
      const id = item.id;
      const productID = item.productID;
      const sectionID = item.sectionID
      const rate = item.rate;
      const discount = item.discount;
      const price = item.price;
      const sectionValues = item.productSizes;
      const image = images[index] ? images[index].filename : "";
      const product = await Product.count({ where: { productID, id } });
      if (product === 0) {
        const newProduct = await Product.create({ productID, rate, discount, price, image });
        if (newProduct) {
          givenID.push(newProduct.id);
          const productSizes = item.productSizes.map((sizeItem) => ({
            productID,
            sectionID:sectionID || newProduct.id,
            size: sizeItem.size,
            quantity: sizeItem.quantity,
            price: sizeItem.price
          }));
          const section = await Section.bulkCreate(productSizes)
        }
        const count = await Product.count({ where: { productID } });
        if (count) {
          const newProducts = await Product.update({ count }, { where: { productID } });
        }
      } else {
        const updateProduct = await Product.update({ rate, discount, price, image }, { where: { id } });
        const infoSectionIDs = item.productSizes.map(item => item.id||0);
        const givenSectionIDs = [];
        const infoSectionID = item.productSizes.map(item => item.sectionID);
        for (let i = 0; i < sectionValues.length; i++) {
          const sizeItem = sectionValues[i];
          const infoId = sizeItem.id;
          const infoSectionId = sizeItem.sectionID;
          const infoSectionSize = sizeItem.size;
          const infoSectionQuantity = sizeItem.quantity;
          const infoSectionPrice = sizeItem.price;
          const section = await Section.count({where:{sectionID:infoSectionId,id:infoId}});
          if(section === 0) {
            const newSection = await Section.create({productID,sectionID:infoSectionId,size:infoSectionSize,price:infoSectionPrice,quantity:infoSectionQuantity})
            givenSectionIDs.push(newSection.id);
          } else {
            const updateSection = await Section.update({size:infoSectionSize,quantity:infoSectionQuantity,price:infoSectionPrice},{where:{id:infoId}});
          }
        }
        const sectionIDs = givenSectionIDs.concat(infoSectionIDs);
        const removeSections = await Section.destroy({where:{sectionID:infoSectionID,id:{[Sequelize.Op.notIn]: sectionIDs}}})
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
    const product = await Product.findAll({where:{productID}});
    const sectionID = product.map(item => item.id);
    const remove = await Product.destroy({ where: { productId: productID } });
    if(remove){
      const sectionRemove = await Section.destroy({where:{sectionID:sectionID}});
    }
    return res.status(200).json({ statuscode: 200, message: "deleted" })
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message })
  }
}




module.exports = { addProduct, showAllProduct, showProduct, editProduct, deleteProduct };