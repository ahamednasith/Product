module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        userID: {
            type: DataTypes.INTEGER
        },
        name:{
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        signUpDate: {
            type: DataTypes.DATE
        },
        loginDate: {
            type: DataTypes.DATE
        },
    }, {
        timestamps: false
    });
    return User;
}