const LeaveRequest = require('../models/LeaveRequests');
//running this to test the workflow
// Create Leave Request (non-managers only)
exports.createLeaveRequest = async (req, res) => {
    try {
        const person = req.user?.name;
        if (!person) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        const leaveRequest = new LeaveRequest({
            person,
            start: req.body.start,
            end: req.body.end,
            status: 'pending'
        });

        await leaveRequest.save();
        res.status(201).json(leaveRequest);
    } catch (error) {
        console.error("Create error:", error);
        res.status(500).json({ message: 'Failed to create leave request.', error: error.message });
    }
};

// Get all leave requests
exports.getLeaveRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch leave requests', error: error.message });
    }
};
