const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Shift = require('../models/Shift');
const { createShift, updateShift, deleteShift, getShifts } = require('../controllers/shiftController');
const { expect } = chai;

describe('CreateShift Function Test', () => {
  afterEach(() => sinon.restore());

  it('should create a new shift successfully', async () => {
    const req = {
      body: {
        person: "Alice Johnson",
        start: new Date("2025-08-11T08:00:00Z"),
        end: new Date("2025-08-11T16:00:00Z"),
      },
    };

    // Stub instance save() to resolve with "this"
    const saveStub = sinon.stub(Shift.prototype, 'save').resolvesThis();

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createShift(req, res);

    expect(saveStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    // controller returns the created doc
    expect(res.json.firstCall.args[0]).to.include({
      person: req.body.person,
      start: req.body.start,
      end: req.body.end,
    });
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(Shift.prototype, 'save').throws(new Error('DB Error'));

    const req = {
      body: {
        person: "Test2 Johnson",
        start: new Date("2026-08-11T08:00:00Z"),
        end: new Date("2026-09-11T16:00:00Z"),
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createShift(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({
      message: 'Failed to create shift.',
      error: 'DB Error',
    })).to.be.true;
  });
});


describe('Update Function Test', () => {
  afterEach(() => sinon.restore());

  it('should update shift successfully', async () => {
    const shiftId = new mongoose.Types.ObjectId();
    const existingShift = {
      _id: shiftId,
      person: "Alice Johnson",
      start: new Date("2025-08-11T08:00:00Z"),
      end: new Date("2025-08-11T16:00:00Z"),
      save: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(Shift, 'findById').resolves(existingShift);

    const req = {
      params: { id: shiftId },
      body: {
        person: "New Person",
        start: new Date("2025-08-12T08:00:00Z"),
        end: new Date("2025-08-12T16:00:00Z"),
      },
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updateShift(req, res);

    expect(findByIdStub.calledOnceWith(shiftId)).to.be.true;
    expect(existingShift.person).to.equal("New Person");
    expect(existingShift.start.toISOString()).to.equal(req.body.start.toISOString());
    expect(existingShift.end.toISOString()).to.equal(req.body.end.toISOString());
    expect(res.status.called).to.be.false;
    expect(res.json.calledOnce).to.be.true;
  });

  it('should return 404 if shift is not found', async () => {
    sinon.stub(Shift, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateShift(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Shift not found' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    sinon.stub(Shift, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateShift(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({
      message: 'Failed to update shift',
      error: 'DB Error',
    })).to.be.true;
  });
});


describe('GetShift Function Test', () => {
  afterEach(() => sinon.restore());

  it('should return all shifts', async () => {
    const shifts = [
      { _id: new mongoose.Types.ObjectId(), person: "Test3 Johnson", start: new Date("2025-08-11T08:00:00Z"), end: new Date("2025-08-11T16:00:00Z") },
      { _id: new mongoose.Types.ObjectId(), person: "Test4 Johnson", start: new Date("2025-08-11T08:00:00Z"), end: new Date("2025-08-11T16:00:00Z") },
    ];

    const findStub = sinon.stub(Shift, 'find').resolves(shifts);

    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getShifts(req, res);

    expect(findStub.calledOnce).to.be.true; // no filter argument in controller
    expect(res.json.calledWith(shifts)).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it('should return 500 on error', async () => {
    sinon.stub(Shift, 'find').throws(new Error('DB Error'));

    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getShifts(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({
      message: 'Failed to fetch shifts',
      error: 'DB Error',
    })).to.be.true;
  });
});


describe('DeleteShift Function Test', () => {
  afterEach(() => sinon.restore());

  it('should delete a shift successfully', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = { params: { id } };

    const findByIdAndDeleteStub = sinon.stub(Shift, 'findByIdAndDelete').resolves({ _id: id });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteShift(req, res);

    expect(findByIdAndDeleteStub.calledOnceWith(id)).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: 'Shift deleted successfully' })).to.be.true;
  });

  it('should return 404 if shift is not found', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = { params: { id } };

    sinon.stub(Shift, 'findByIdAndDelete').resolves(null);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteShift(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ error: 'Shift not found' })).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = { params: { id } };

    sinon.stub(Shift, 'findByIdAndDelete').throws(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteShift(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ error: 'Failed to delete shift' })).to.be.true;
  });
});
