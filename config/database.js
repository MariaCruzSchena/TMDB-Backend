const Sequelize = require('sequelize');
require("dotenv").config();
const { DB } = process.env;

module.exports = new Sequelize(DB, null, null, {
   dialect : 'postgres',
   host: 'localhost',
   logging: false,
})




