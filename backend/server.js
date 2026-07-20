require('dotenv').config();
const express = require('express');
const cors = require('cors');


const connectDB = require('./config/database');
const weatherRoutes = require('./routes/weatherRoutes');
const setupCronJobs = require('./utils/cronJobs');

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
   // Replace with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"], // Add 'Authorization' here
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();
setupCronJobs();

app.use('/api', weatherRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
