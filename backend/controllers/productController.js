const db = require('../models/index');
const { Sequelize, Op } = require('sequelize');
const dateTime = require('date-and-time');
const bcrypt = require('bcrypt');
const { encrypt, crypt, generateToken, decrypt } = require('../utils/helper');
const Product = db.product;
const Section = db.section;
const User = db.user;
const Image = db.image;

const signUp = async (req, res) => {
  try {
    const userID = Math.floor(100000 + Math.random() * 900000);
    const name = req.body.name;
    const email = encrypt(String(req.body.email));
    const password = await crypt(String(req.body.password));
    const signUpDate = new Date();
    const loginDate = dateTime.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    const emailExists = await User.count({ where: { email } });
    if (emailExists >= 1) {
      return res.status(420).json({ statuscode: 420, message: "The Given Email Already Exist" });
    } else {
      const user = await User.create({ userID, name, email, password, signUpDate, loginDate });
      const token = generateToken(userID, loginDate)
      return res.status(200).json({ statuscode: 200, message: "Created", token: token, user: { userID: user.userID, email: decrypt(user.email) } });
    }
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message });
  }
}

const verify = async (req, res) => {
  try {
    const email = encrypt(String(req.body.email));
    const password = String(req.body.password);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(420).json({ statuscode: 420, message: "This Email And Password  Have Not Registered please Signup" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ statuscode: 401, message: "Invalid email or password" });
      } else {
        return res.status(200).json({ statuscode: 200, data: { userID: user.userID, email: decrypt(user.email) } })
      }
    }
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message });
  }
}

const addProduct = async (req, res) => {
  try {
    const sectionImages = req.files.sectionImages;
    const productImages = req.files.productImages;
    const productInfo = req.body.products;
    const productTag = req.body.productTag;
    const productID = Math.floor(100000 + Math.random() * 900000);
    const productName = productInfo[0].productName
    const description = productInfo[0].description
    const category = productInfo[0].category
    const product = productInfo.map((input, index) => ({
      productID,
      userID: input.userID,
      productName,
      description,
      category,
      productTag,
      rate: input.rate,
      discount: input.discount,
      price: input.price,
      image: sectionImages[index] ? sectionImages[index].filename : "",
    }))
    const sellingPrice = await Product.bulkCreate(product);
    const userID = productInfo[0].userID;
    if (sellingPrice) {
      const productSizes = productInfo.forEach(async (products, index) => {
        const sectionID = sellingPrice[index].id;
        const productDetails = products.productSizes.map((item) => ({
          userID,
          productID,
          sectionID,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        }));
        const section = await Section.bulkCreate(productDetails);
      });
      const imageDetails = [];
      productImages.forEach((image) => {
        const imageObject = {
          userID: productInfo[0].userID,
          productID,
          image: image.filename,
        };
        imageDetails.push(imageObject);
      });
      const imageUpload = await Image.bulkCreate(imageDetails);
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
    const userID = req.params.userID;
    const product = await Product.findAll({ where: { userID } });
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
        productName: products.productName,
        category: products.category,
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
    const images = await Image.findAll({
      where: {
        productID
      }
    })
    const productImages = images.map((input) => ({ id: input.id, image: `http://localhost:3000/public/images/${input.image}` }))
    const sectionData = {};
    sections.forEach(section => {
      const sectionID = section.sectionID;
      if (!sectionData[sectionID]) {
        sectionData[sectionID] = [];
      }
      sectionData[sectionID].push({
        id: section.id,
        userID: section.userID,
        sectionID: section.sectionID,
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
          userID: product.userID,
          productID: product.productID,
          productName: product.productName,
          description: product.description,
          category: product.category,
          productTag: product.productTag,
          rate: product.rate,
          discount: product.discount,
          price: product.price,
          productSizes: sectionInfo,
          image: "",
        };
      });
      return res.status(200).json({ statuscode: 200, productData, productImages, image });
    } else {
      const productData = products.map(product => {
        const sectionInfo = sectionData[product.id];
        return {
          id: product.id,
          userID: product.userID,
          productID: product.productID,
          productName: product.productName,
          description: product.description,
          category: product.category,
          productTag: product.productTag,
          rate: product.rate,
          discount: product.discount,
          price: product.price,
          productSizes: sectionInfo,
          image: `http://localhost:3000/public/images/${product.image}`,
        };
      });
      return res.status(200).json({ statuscode: 200, productData, productImages, image, });
    }
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message });
  }
};




const editProduct = async (req, res) => {
  try {
    const productInfo = req.body.products;
    const sectionImages = req.files.sectionImages;
    const productImages = req.files.productImages || "";
    const productTag = req.body.productTag;
    const productImagesID = req.body.productImages;
    const imagesID = productImagesID.map((input) => input.id || 0);
    const productID = productInfo.map(item => item.productID);
    const userID = productInfo[0].userID;
    const providedIds = productInfo.map(item => item.id || 0);
    const givenID = [];
    const givenImageID = [];
    for (imgIndex = 0; imgIndex < productImages.length; imgIndex++) {
      const imageItem = productImages[imgIndex];
      const image = imageItem.filename;
      const imageProductId = productID[0];
      const newImages = await Image.create({ userID, productID: imageProductId, image });
      if (newImages) {
        givenImageID.push(newImages.id);
      }
      const newImageIDs = givenImageID.concat(imagesID);
      const removeImages = await Image.destroy({ where: { productID, id: { [Sequelize.Op.notIn]: newImageIDs } } });
    }
    for (index = 0; index < productInfo.length; index++) {
      const item = productInfo[index];
      const maxIndex = productInfo.length - 1;
      const input = productInfo[maxIndex];
      const id = item.id;
      const productID = item.productID;
      const sectionID = item.sectionID;
      const productName = input.productName;
      const description = input.description;
      const category = input.category;
      const rate = item.rate;
      const discount = item.discount;
      const price = item.price;
      const sectionValues = item.productSizes;
      const image = sectionImages[index] ? sectionImages[index].filename : "";
      const product = await Product.count({ where: { productID, id } });
      if (product === 0) {
        const newProduct = await Product.create({ userID, productID, productName, description, category, productTag, rate, discount, price, image });
        if (newProduct) {
          givenID.push(newProduct.id);
          const productSizes = item.productSizes.map((sizeItem) => ({
            productID,
            userID,
            sectionID: sectionID || newProduct.id,
            size: sizeItem.size,
            quantity: sizeItem.quantity,
            price: sizeItem.price
          }));
          const section = await Section.bulkCreate(productSizes);
        }
        const count = await Product.count({ where: { productID } });
        if (count) {
          const newProducts = await Product.update({ count }, { where: { productID } });
        }
      } else {
        const updateProduct = await Product.update({ productName, description, category, productTag, rate, discount, price, image }, { where: { id } });
        const infoSectionIDs = item.productSizes.map(item => item.id || 0);
        const givenSectionIDs = [];
        const infoSectionID = item.productSizes.map(item => item.sectionID);
        for (let i = 0; i < sectionValues.length; i++) {
          const sizeItem = sectionValues[i];
          const infoId = sizeItem.id;
          const infoSectionId = sizeItem.sectionID;
          const infoSectionSize = sizeItem.size;
          const infoSectionQuantity = sizeItem.quantity;
          const infoSectionPrice = sizeItem.price;
          const section = await Section.count({ where: { sectionID: infoSectionId, id: infoId } });
          if (section === 0) {
            const newSection = await Section.create({ userID, productID, sectionID: infoSectionId, size: infoSectionSize, price: infoSectionPrice, quantity: infoSectionQuantity })
            givenSectionIDs.push(newSection.id);
          } else {
            const updateSection = await Section.update({ size: infoSectionSize, quantity: infoSectionQuantity, price: infoSectionPrice }, { where: { id: infoId } });
          }
        }
        const sectionIDs = givenSectionIDs.concat(infoSectionIDs);
        const removeSections = await Section.destroy({ where: { sectionID: infoSectionID, id: { [Sequelize.Op.notIn]: sectionIDs } } })
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
    const product = await Product.findAll({ where: { productID } });
    const sectionID = product.map(item => item.id);
    const remove = await Product.destroy({ where: { productId: productID } });
    if (remove) {
      const sectionRemove = await Section.destroy({ where: { sectionID: sectionID } });
      const imageRemove = await Image.destroy({ where: { productID: productID } })
    }
    return res.status(200).json({ statuscode: 200, message: "deleted" })
  } catch (error) {
    return res.status(500).json({ statuscode: 500, error: error.message })
  }
}




module.exports = { signUp, verify, addProduct, showAllProduct, showProduct, editProduct, deleteProduct };