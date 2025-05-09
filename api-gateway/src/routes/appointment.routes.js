const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth.middleware');

const APPOINTMENT_URL = process.env.APPOINTMENT_SERVICE_URL;

// 🔒 Route protégée par JWT
router.get('/', auth, async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_URL}/api/appointments`);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching appointments:', err.message);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

module.exports = router;
