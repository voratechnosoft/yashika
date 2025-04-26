const mongoose = require("mongoose");

const NOTIFICATION_TYPE = {
  DEFAULT: 0,
  INQURY: 1,
  CATALOGUPDATE: 2,
};

const userNotificationSchema = mongoose.Schema(
  {
    vUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User Id" },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema({
  vTitle: { type: String },
  vMessage: { type: String },
  vTopic: { type: String },
  iNotificationType: {
    type: Number,
    enum: Object.values(NOTIFICATION_TYPE),
    default: NOTIFICATION_TYPE.DEFAULT,
  },
  // arrUserNotification: [userNotificationSchema],
  vUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: false,
  },
  vAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: false,
  },
  isAdminNotification: { type: Boolean, default: false },
  iInquiryStatus: { type: String, default: "" }, // 2 - Accept, 3 - Reject
  vCatalogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catalog",
    required: false,
  },
  vInquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inquiry",
    required: false,
  },
  isPending: { type: Boolean, default: true },
  isStatus: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblNotification", notificationSchema);
