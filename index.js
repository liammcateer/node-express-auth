const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const port = process.env.PORT || 3000

app.get('/', function (req, res) {
    res.send('Hello World')
})

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.319xr.mongodb.net/${process.env.DB_NAME}`
console.log(dbURI)
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));
