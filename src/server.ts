import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {initDB} from './config/db';
import githubRoutes from './routes/v1/githubRoutes';
import {limiter, securityHeaders} from './middleware/security';

const PORT = process.env.PORT || 3000;
const app = express();
initDB();

app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(securityHeaders);
app.use(limiter);
app.use('/api/v1/github', githubRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});