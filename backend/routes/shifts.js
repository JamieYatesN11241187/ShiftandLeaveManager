// routes/events.js
const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.get('/', shiftController.getShifts);
router.post('/', shiftController.createShift);

router.delete('/:id', shiftController.deleteShift);
router.put('/:id', shiftController.updateShift);

module.exports = router;