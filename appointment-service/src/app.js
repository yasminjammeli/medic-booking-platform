require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/appointment.routes');

const app = express();
app.use(express.json());
app.use('/api/appointments', routes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Appointment service running on port ${PORT}`));
