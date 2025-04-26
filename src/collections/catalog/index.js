const mongoose = require("mongoose");

const PRODUCTSTATUS = {
  INVISIBLE: 1,
  VISIBLE: 2,
};

const catalogSchema = new mongoose.Schema({
  vBarcodeId: { type: String, required: true },
  vBarcodeImage: { type: String, default: "" },
  arrProductImage: {
    type: Array,
    default: [],
  },
  arrFavorites: { type: Array, default: [] },
  vDesignNumber: { type: String, default: "" },
  iSellerNumber: { type: Number, default: 0 },
  vCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  vFusionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fusion",
    required: false,
  },
  vFabricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric",
    required: false,
  },
  vFabricColor: { type: String, default: "" },
  vOtherColor: { type: String, default: "" },
  vFabricPannaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric Panna",
    required: false,
  },
  vEmbroideryWorkHeightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Embroidery Work Height",
    required: false,
  },
  vFarmaRate: { type: String, default: "" },
  vFarmaRateWithStoan: { type: String, default: "" },
  vLessBorder: { type: String, default: "" },
  vLessBorderWithStoan: { type: String, default: "" },
  vPlainMeterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plain Meter",
    required: false,
  },
  vFabricPlainIncludedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric Plain Included",
    required: false,
  },
  vPlainMeter: { type: String, default: "" },
  vFabricPlainMeter: { type: String, default: "" },
  iPlainFabricRate: { type: Number, default: 0 },
  iProductStatus: {
    type: Number,
    enum: Object.values(PRODUCTSTATUS),
    default: PRODUCTSTATUS.INVISIBLE,
  },
  vGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: false,
  },
  iFrameNumber: { type: Number, default: 0 },
  iFabricSale: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblCatalog", catalogSchema);
