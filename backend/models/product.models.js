module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        userID: {
            type: DataTypes.INTEGER
        },
        productID: {
            type: DataTypes.INTEGER
        },
        productName: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        category: {
            type: DataTypes.STRING
        },
        productTag: {
            type: DataTypes.STRING,
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
        image: {
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