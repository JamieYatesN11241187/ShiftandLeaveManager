// routes/events.js
const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.get('/', shiftController.getShifts);
router.delete('/:id', shiftController.deleteShift);
router.put('/:id', shiftController.updateShift);
router.post('/', shiftController.createShift);

module.exports = router;