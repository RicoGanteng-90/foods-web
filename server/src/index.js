import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import connectDB from './config/db.js';

connectDB();
import foodsRoute from './routes/foodsRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use('/api/foods', foodsRoute);
app.use('/api/categories', categoryRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server rocketing on ${process.env.SERVER_URL}:${PORT}`);
});
