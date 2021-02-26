import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { requireAuth } from './middleware/authMiddleware';

require('dotenv').config()

const app = express();
const authRoutes = require('./routes/authRoutes')
const port = process.env.PORT || 3000

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

const dbURI = process.env.DB_CONNECTION_STRING;
if(dbURI){
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result: any) => app.listen(port, () => console.log('Server started at: ', 'http://localhost:' + port)))
  .catch((err: any) => console.log(err));
}

  
app.get('/', (req: express.Request, res: express.Response) => {
  res.render('home');
});

app.get('/secret', requireAuth, (req: express.Request, res: express.Response) => {
  res.render('lockedPage');
});

app.use(authRoutes)