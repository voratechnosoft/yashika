const mongoose = require("mongoose");

const fabricPlainIncludedSchema = new mongoose.Schema({
  vName: { type: String },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
  dtDeletedAt: Number,
});

module.exports = mongoose.model(
  "tblFabricPlainIncluded",
  fabricPlainIncludedSchema
);
