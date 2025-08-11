// controllers/shiftController.js
const Shift = require('../models/Shift');

exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shifts', error: error.message });
  }
};