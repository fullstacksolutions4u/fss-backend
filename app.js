import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://www.fullstacksolutions.in'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FSS Backend Server is running',
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;