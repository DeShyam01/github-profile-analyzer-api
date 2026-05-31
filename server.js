const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
const app = express();
const githubRoutes = require('./src/routes/githubRoutes');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/github', githubRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});