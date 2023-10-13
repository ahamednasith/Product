module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        userID: {
            type: DataTypes.INTEGER
        },
        productID: {
            type: DataTypes.INTEGER
        },
        rate: {
            type: DataTypes.INTEGER
        },
        discount: {
            type: DataTypes.INTEGER
        },
        price: {
            type: DataTypes.INTEGER
        },
        image:{
            type: DataTypes.STRING
        },
        count: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
    return Product;
}