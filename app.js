import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './config';

// routes
import authRoutes from './routes/api/auth';
import userRoutes from './routes/api/users';
import eventRoutes from './routes/api/events';
import categoryRoutes from './routes/api/categories';
import subcategoryRoutes from './routes/api/subCategory';
import langRoutes from './routes/api/language';
import logger from './middleware/logger';

const { MONGO_URI } = config;

const app = express();

// CORS Middleware
app.use(cors());
// Logger Middleware
app.use(morgan('dev'));
// Bodyparser Middleware

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// DB Config
const db = MONGO_URI;

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }) // Adding new mongo url parser
  .then(() => logger.info('MongoDB Connected...'))
  .catch(err => logger.error('MongoDb Connect Error', err));

// Use Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/event', eventRoutes);
app.use('/category', categoryRoutes);
app.use('/sub_category', subcategoryRoutes);
app.use('/language', langRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

export default app;
