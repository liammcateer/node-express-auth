import express from 'express';
import mongoose from 'mongoose';
require('dotenv').config()
const app = express();
const authRoutes = require('./routes/authRoutes')
const port = process.env.PORT || 3000

app.use(express.json());

const dbURI = process.env.DB_CONNECTION_STRING;
if(dbURI){
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result: any) => app.listen(port))
  .catch((err: any) => console.log(err));
}

  
app.get('/', function (req: express.Request, res) {
    res.send('Hello World')
})

app.use(authRoutes)