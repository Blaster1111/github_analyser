import express from "express";
import dotenv from 'dotenv';
import analysisRoutes from './routes/analysisRoutes.js';
import { errorHandler, notFound } from './utils/errorHandler.js';
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// Routes
app.use('/api', analysisRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
