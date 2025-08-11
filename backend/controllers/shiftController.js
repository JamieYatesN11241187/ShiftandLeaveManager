// controllers/shiftController.js
const Shift = require('../models/Shift');

exports.createShift = async (req, res) => {
  try {
    const { person, start, end } = req.body;
    const shift = new Shift({
      person: req.body.person,
      start: req.body.start,
      end: req.body.end,
    });
    await shift.save();
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create shift.', error: error.message });
  }
};

exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shifts', error: error.message });
  }
};
