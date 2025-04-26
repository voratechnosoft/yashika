const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  vName: { type: String, require: true },
  vBannerImage: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtExpireTime: Number,
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblBanner", bannerSchema);
