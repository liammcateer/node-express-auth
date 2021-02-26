import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { configuration } from './configuration';
import { requireAuth } from './middleware/authMiddleware';

const app = express();
const authRoutes = require('./routes/authRoutes')

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');


mongoose.connect(configuration.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then((result: any) => app.listen(configuration.port, () => console.log('Server started on port:', configuration.port)))
.catch((err: any) => console.log(err));

  
app.get('/', (req: express.Request, res: express.Response) => {
  res.render('home');
});

app.get('/secret', requireAuth, (req: express.Request, res: express.Response) => {
  res.render('lockedPage');
});

app.use(authRoutes)