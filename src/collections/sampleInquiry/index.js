const mongoose = require("mongoose");

const INQUIRY_STATUS = {
  PENDING: 1,
  ACCEPT: 2,
  REJECT: 3,
};

const sampleInquirySchema = new mongoose.Schema({
  vCatalogId: { type: mongoose.Schema.Types.ObjectId, ref: "Catalog" },
  vMeter: { type: String, default: "" },
  vColor: { type: String, default: "" },
  vFabricQuality: { type: String, default: "" },
  vFabricPanna: { type: String, default: "" },
  vBorder: { type: String, default: "" },
  vExtraPlainFabric: { type: String, default: "" },
  vDescription: { type: String, default: "" },
  vFusion: { type: String, default: "" },
  vDate: { type: String, default: "" },
  vReason: { type: String, default: "" },
  vRecording: { type: String, default: "" },
  iInquiryStatus: {
    type: Number,
    enum: Object.values(INQUIRY_STATUS),
    default: INQUIRY_STATUS.PENDING,
  },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblSampleInquiry", sampleInquirySchema);
