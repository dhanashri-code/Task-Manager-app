const express = require('express');
const router = express.Router();
const { chatbotResponse } = require('../controllers/chatBotController');
const authenticateToken = require("../middleware/authJwt");

router.post('/chatbot', authenticateToken , chatbotResponse);

module.exports = router;
