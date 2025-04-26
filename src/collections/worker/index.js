const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  vWorkerName: { type: String, require: true },
  vWorkerImage: { type: String, default: "" },
  vMobile: { type: String, default: "" },
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblWorker", workerSchema);
