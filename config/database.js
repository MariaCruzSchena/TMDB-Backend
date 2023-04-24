const Sequelize = require('sequelize');
require("dotenv").config();
const { DB, USER, PASSWORD, HOST } = process.env;

module.exports = new Sequelize(DB, USER, PASSWORD, {
   dialect : 'postgres',
   host: HOST,
   logging: false,
})




