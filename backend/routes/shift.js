// routes/events.js
const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.get('/', shiftController.getShifts);
router.post('/', shiftController.createShift);


module.exports = router;