import express from 'express';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1); 
  }
};

startServer();
