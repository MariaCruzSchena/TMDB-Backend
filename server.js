const express = require('express');
const volleyball = require('volleyball');
const cors= require("cors");
const db = require('./config/database.js');
const router = require('./routes');
require("dotenv").config();
const { PORT, FRONTPORT } = process.env;
const app = express();

app.use(volleyball);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], credentials: true,
}));
app.get('/', (req, res) => {res.send('INDEX')})
app.use("/api", router);

app.use((err, req, res, next) => {
 console.log("Error");
 console.log(err);
 res.status(500).send(err.message);
});

db.sync({ force: false}).then(() => {
 app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
 });
});


module.exports = app;
