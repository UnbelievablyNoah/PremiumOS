const {
  Sequelize
} = require('sequelize');
module.exports = new Sequelize(process.env.DB, process.env.DB_User, process.env.DB_Password, {
  dialect: 'mysql'
});