// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, leaveController.createLeaveRequest);

module.exports = router;