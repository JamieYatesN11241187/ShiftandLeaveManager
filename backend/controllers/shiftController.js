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
feature/shiftManagement/UpdateShift

exports.updateShift = async (req, res) => {
  const { id } = req.params;
  const { person, start, end } = req.body;

  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    shift.person = person || shift.person;
    shift.start = start || shift.start;
    shift.end = end || shift.end;
    const updatedShift = await shift.save();
    res.json(updatedShift);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: 'Failed to update shift', error: error.message });
  }
};