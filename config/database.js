const Sequelize = require('sequelize');
require("dotenv").config();
const { DB, USER, PASSWORD } = process.env;

module.exports = new Sequelize(DB, USER, PASSWORD, {
   dialect : 'postgres',
   host: 'dpg-ch38kqaut4m9tsc55e7g-a',
   logging: false,
})




