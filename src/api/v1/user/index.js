const { Router } = require("express");
const multer = require("multer");
const commonResolver = require("../../../utils/commonResolver");

const router = new Router();

// SCHEMA
const deviceTokenSchema = require("./deviceToken");
const homeSchema = require("./home");
const getCategoryWiseCatalogSchema = require("./getCategoryWiseCatalog");
const editUserProfileSchema = require("./editUserProfile");
const sellerCountUpdateSchema = require("./sellerCountUpdate");
const likeAndUnLikeCatalogSchema = require("./likeAndUnLikeCatalog");
const allSellerSchema = require("./allSeller");
const allTrendingSchema = require("./allTrending");
const likeListSchema = require("./likeList");

// SERVICES
const getUserDetails = require("../../../services/user/getUserDetails");
const getHomeDetails = require("../../../services/user/getHomeDetails");
const getCategoryWiseCatalog = require("../../../services/user/getCategoryWiseCatalog");
const updateDeviceToken = require("../../../services/user/updateDeviceToken");
const onUserLogOut = require("../../../services/user/logout");
const editUserProfile = require("../../../services/user/editUserProfile");
const sellerCountUpdate = require("../../../services/user/sellerCountUpdate");
const getAllSeller = require("../../../services/user/getAllSeller");
const getAllTrending = require("../../../services/user/getAllTrending");
const likeAndUnLikeCatalog = require("../../../services/user/likeAndUnLikeCatalog");
const getLikeList = require("../../../services/user/getLikeList");

// Upload Image
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/image/profile");
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let n = d.getTime();
    let fileName = "profile-" + n + "-" + file.originalname;
    cb(null, fileName);
  },
});
const imageUpload = multer({ storage: storage });

router.post(
  "/getUserDetails",
  commonResolver.bind({
    modelService: getUserDetails,
    isRequestValidateRequired: false,
  })
);

router.post(
  "/home",
  commonResolver.bind({
    modelService: getHomeDetails,
    isRequestValidateRequired: true,
    schemaValidate: homeSchema,
  })
);

router.post(
  "/getCategoryWiseCatalog",
  commonResolver.bind({
    modelService: getCategoryWiseCatalog,
    isRequestValidateRequired: true,
    schemaValidate: getCategoryWiseCatalogSchema,
  })
);

router.post(
  "/getAllSeller",
  commonResolver.bind({
    modelService: getAllSeller,
    isRequestValidateRequired: false,
    schemaValidate: allSellerSchema,
  })
);

router.post(
  "/getAllTrending",
  commonResolver.bind({
    modelService: getAllTrending,
    isRequestValidateRequired: false,
    schemaValidate: allTrendingSchema,
  })
);

router.post(
  "/updateDeviceToken",
  commonResolver.bind({
    modelService: updateDeviceToken,
    isRequestValidateRequired: true,
    schemaValidate: deviceTokenSchema,
  })
);

router.post(
  "/likeAndUnLikeCatalog",
  commonResolver.bind({
    modelService: likeAndUnLikeCatalog,
    isRequestValidateRequired: true,
    schemaValidate: likeAndUnLikeCatalogSchema,
  })
);

router.post(
  "/getLikeList",
  commonResolver.bind({
    modelService: getLikeList,
    isRequestValidateRequired: false,
    schemaValidate: likeListSchema,
  })
);

router.post(
  "/edit-user-profile",
  imageUpload.single("vProfileImage"),
  commonResolver.bind({
    modelService: editUserProfile,
    isRequestValidateRequired: false,
    schemaValidate: editUserProfileSchema,
  })
);

router.post(
  "/logout",
  commonResolver.bind({
    modelService: onUserLogOut,
    isRequestValidateRequired: false,
  })
);

router.post(
  "/sellerCountUpdate",
  commonResolver.bind({
    modelService: sellerCountUpdate,
    isRequestValidateRequired: true,
    schemaValidate: sellerCountUpdateSchema,
  })
);

module.exports = router;
