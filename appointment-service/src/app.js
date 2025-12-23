require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/appointment.routes');
const promClient = require('prom-client'); 

const app = express();
app.use(express.json());

// PROMETHEUS METRICS - AJOUTER CETTE SECTION

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// Compteur custom pour les rendez-vous
const appointmentCounter = new promClient.Counter({
  name: 'appointments_created_total',
  help: 'Total number of appointments created',
  registers: [register]
});

const appointmentCancelCounter = new promClient.Counter({
  name: 'appointments_cancelled_total',
  help: 'Total number of appointments cancelled',
  registers: [register]
});

// Exporter les compteurs pour les utiliser dans le controller
app.locals.appointmentCounter = appointmentCounter;
app.locals.appointmentCancelCounter = appointmentCancelCounter;

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    httpRequestCounter.inc({ method: req.method, route, status_code: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route, status_code: res.statusCode }, duration);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


app.use('/api/appointments', routes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Appointment service running on port ${PORT}`));
