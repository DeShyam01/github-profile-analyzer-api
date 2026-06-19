const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
const app = express();
const githubRoutes = require('./src/routes/githubRoutes');
const { limiter, securityHeaders } = require('./src/middleware/security');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(securityHeaders);
app.use(limiter);
app.use('/api/github', githubRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});