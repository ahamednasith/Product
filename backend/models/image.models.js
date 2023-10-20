module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        userID: {
            type: DataTypes.INTEGER
        },
        productID: {
            type: DataTypes.INTEGER
        },
        image: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: false
    });
    return Image;
}