// Configuración del server
const express = require('express');
const volleyball = require('volleyball');
const cors= require("cors");

//Database server
const db = require('./config/database.js');
const router = require('./routes');

const app = express();

app.use(volleyball);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:"http://localhost:3000",
  methods:["GET", "POST", "DELETE", "OPTIONS"], credentials: true,
}));

app.get('/', (req, res) => {res.send('INDEX')})
app.use("/api", router);


// Error handling middleware
app.use((err, req, res, next) => {
 console.log("Error");
 console.log(err);
 res.status(500).send(err.message);
});


db.sync({ force: false}).then(() => {
 app.listen(5432, () => {
   console.log("Server listening on port 5432");
 });
});


module.exports = app;
