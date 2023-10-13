const dbConfig = require('../db.config');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: 8889,
    dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.product = require('./product.models')(sequelize, DataTypes);
db.section = require('./section.models')(sequelize,DataTypes);
db.user = require('./user.models')(sequelize,DataTypes);

db.sequelize.sync().then(() => console.log('Connected'));

module.exports = db;