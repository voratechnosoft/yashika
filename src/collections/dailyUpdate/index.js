const mongoose = require("mongoose");

const dailyUpdateSchema = new mongoose.Schema({
  vMachinId: { type: mongoose.Schema.Types.ObjectId, ref: "Machin" },
  vWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Machin" },
  vWorkingTime: { type: String },
  vWorkingDay: { type: String },
  vMachineCondition: { type: String },
  vDescription: { type: String, default: "" },
  vRecording: { type: String, default: "" },
  iFrame: { type: Number, default: 0 },
  iThreadBreak: { type: Number, default: 0 },
  iCurrentStitch: { type: Number, default: 0 },
  iRunningStitch: { type: Number, default: 0 },
  iDesignNumber: { type: Number, default: 0 },
  iStopTimeHours: { type: Number, default: 0 },
  iStopTimeMinute: { type: Number, default: 0 },
  vDate: { type: Number, default: 0 },
  iMachineCalculateStitch: { type: Number, default: 0 },
  iCalculateOldStitch: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblDailyUpdate", dailyUpdateSchema);
