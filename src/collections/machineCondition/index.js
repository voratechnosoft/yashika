const mongoose = require("mongoose");

const MACHINESTATUS = {
  WORKING: 1,
  ISSUE: 2,
  STOP: 3,
};

const machineConditionSchema = new mongoose.Schema({
  vMachineName: { type: String },
  iMachineNumber: { type: Number },
  iMachineStatus: {
    type: Number,
    enum: Object.values(MACHINESTATUS),
    default: MACHINESTATUS.WORKING,
  },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
  dtDeletedAt: Number,
});

module.exports = mongoose.model("tblMachineCondition", machineConditionSchema);
