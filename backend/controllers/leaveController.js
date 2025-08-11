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

// Update Leave Request
exports.updateLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (req.user.role === 'manager') {
            // Managers can only update the status
            leaveRequest.status = req.body.status || leaveRequest.status;
        } else {
            // Non-managers can update their own request (but not status)
            if (leaveRequest.person !== req.user.name) {
                return res.status(403).json({ message: 'You can only update your own leave request.' });
            }
            leaveRequest.start = req.body.start || leaveRequest.start;
            leaveRequest.end = req.body.end || leaveRequest.end;
        }

        const updatedLeaveRequest = await leaveRequest.save();
        res.json(updatedLeaveRequest);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: 'Failed to update leave request', error: error.message });
    }
};