module.exports = (sequelize, DataTypes) => {
    const Section = sequelize.define('section', {
        userID: {
            type: DataTypes.INTEGER
        },
        productID: {
            type: DataTypes.INTEGER
        },
        sectionID: {
            type: DataTypes.INTEGER
        },
        size: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER
        },
        quantity: {
            type: DataTypes.INTEGER
        },
    }, {
        timestamps: false
    });
    return Section;
}