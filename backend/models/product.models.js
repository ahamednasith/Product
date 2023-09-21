module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
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
        count: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
    return Product;
}