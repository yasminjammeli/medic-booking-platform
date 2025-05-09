const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth.middleware'); 

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

// Change these routes to match the full path
router.post('/register', async (req, res) => {
    console.log('Sending data to user service:', req.body); 
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/api/users/register`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('AXIOS ERROR:', err.response?.data || err.message);
        res.status(500).json({ error: 'Registration error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/api/users/login`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        const { response } = err;
        res.status(response?.status || 500).json(response?.data || { error: 'Login error' });
    }
});

module.exports = router;