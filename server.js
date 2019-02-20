import path from 'path';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from './middlewares/passport';
import { api as apiRoutes, auth as authRoutes } from './routes';

const app = express();

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/your-db', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(passport.initialize());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`));