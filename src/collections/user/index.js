const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  vName: { type: String, require: true },
  vMobile: { type: String, require: true },
  vPhoneOtp: { type: String, default: "" },
  arrUserAccess: { type: Array, default: [] },
  vProfileImage: { type: String, default: "" },
  vDeviceToken: { type: String, default: "" },
  vLoginToken: { type: String, default: "" },
  isBlock: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  vUserRoleId: { type: mongoose.Schema.Types.ObjectId, ref: "User Role" },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtExpireTime: Number,
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblUser", userSchema);
