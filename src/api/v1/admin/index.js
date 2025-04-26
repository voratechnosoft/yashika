const { Router } = require("express");
const multer = require("multer");
const commonResolver = require("../../../utils/commonResolver");
const userAuthentication = require("../../../middleware/authentication/userAuthentication");

const router = new Router();

// SCHEMA
const registerSchema = require("./register");
const addUserSchema = require("./addUser");
const userListSchema = require("./userList");
const getUserDetailsSchema = require("./getUserDetails");
const updateUserSchema = require("./updateUser");
const deleteUserSchema = require("./deleteUser");
const userInquiryRequestSchema = require("./userInquiryRequest");
const updateInquiryStatusSchema = require("./updateInquiryStatus");
const deviceTokenSchema = require("./deviceToken");
const editAdminProfileSchema = require("./editAdminProfile");
const addBannerSchema = require("./addBanner");

// SERVICES
const onAdminRegister = require("../../../services/admin/register");
const onAdminLogOut = require("../../../services/admin/logout");
const userList = require("../../../services/admin/userList");
const getUserDetails = require("../../../services/admin/getUserDetails");
const addUser = require("../../../services/admin/addUser");
const updateUser = require("../../../services/admin/updateUser");
const deleteUser = require("../../../services/admin/deleteUser");
const userInquiryRequestList = require("../../../services/admin/userInquiryRequestList");
const updateInquiryStatus = require("../../../services/admin/updateInquiryStatus");
const updateDeviceToken = require("../../../services/admin/updateDeviceToken");
const editAdminProfile = require("../../../services/admin/editAdminProfile");
const addBanner = require("../../../services/admin/addBanner");
const bannerList = require("../../../services/admin/bannerList");
const directLogOut = require("../../../services/admin/directLogOut");

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

// Banner Upload Image
let bannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/image/banner");
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let n = d.getTime();
    let fileName = "banner-" + n + "-" + file.originalname;
    cb(null, fileName);
  },
});
const bannerImageUpload = multer({ storage: bannerStorage });

// Upload Recording
let recordingStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/recording");
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let n = d.getTime();
    let fileName = "recording-" + n + "-" + file.originalname;
    cb(null, fileName);
  },
});
const recordingUpload = multer({ storage: recordingStorage });

router.post(
  "/register",
  commonResolver.bind({
    modelService: onAdminRegister,
    isRequestValidateRequired: true,
    schemaValidate: registerSchema,
  })
);

router.post(
  "/user/add-user",
  userAuthentication,
  imageUpload.single("vProfileImage"),
  commonResolver.bind({
    modelService: addUser,
    isRequestValidateRequired: false,
    schemaValidate: addUserSchema,
  })
);

router.post(
  "/user/allUserList",
  userAuthentication,
  commonResolver.bind({
    modelService: userList,
    isRequestValidateRequired: true,
    schemaValidate: userListSchema,
  })
);

router.post(
  "/user/get-user-details",
  userAuthentication,
  commonResolver.bind({
    modelService: getUserDetails,
    isRequestValidateRequired: true,
    schemaValidate: getUserDetailsSchema,
  })
);

router.post(
  "/user/update-user",
  userAuthentication,
  imageUpload.single("vProfileImage"),
  commonResolver.bind({
    modelService: updateUser,
    isRequestValidateRequired: false,
    schemaValidate: updateUserSchema,
  })
);

router.post(
  "/user/delete-user",
  userAuthentication,
  commonResolver.bind({
    modelService: deleteUser,
    isRequestValidateRequired: true,
    schemaValidate: deleteUserSchema,
  })
);

router.post(
  "/user-inquiry-request",
  userAuthentication,
  commonResolver.bind({
    modelService: userInquiryRequestList,
    isRequestValidateRequired: false,
    schemaValidate: userInquiryRequestSchema,
  })
);

router.post(
  "/update-inquiry-status",
  recordingUpload.single("vRecording"),
  userAuthentication,
  commonResolver.bind({
    modelService: updateInquiryStatus,
    isRequestValidateRequired: true,
    schemaValidate: updateInquiryStatusSchema,
  })
);

router.post(
  "/updateDeviceToken",
  userAuthentication,
  commonResolver.bind({
    modelService: updateDeviceToken,
    isRequestValidateRequired: true,
    schemaValidate: deviceTokenSchema,
  })
);

router.post(
  "/edit-admin-profile",
  userAuthentication,
  imageUpload.single("vProfileImage"),
  commonResolver.bind({
    modelService: editAdminProfile,
    isRequestValidateRequired: false,
    schemaValidate: editAdminProfileSchema,
  })
);

router.post(
  "/logout",
  userAuthentication,
  commonResolver.bind({
    modelService: onAdminLogOut,
    isRequestValidateRequired: false,
  })
);

router.post(
  "/add-banner",
  userAuthentication,
  bannerImageUpload.single("vBannerImage"),
  commonResolver.bind({
    modelService: addBanner,
    isRequestValidateRequired: true,
    schemaValidate: addBannerSchema,
  })
);

router.post(
  "/bannerList",
  userAuthentication,
  commonResolver.bind({
    modelService: bannerList,
    isRequestValidateRequired: false,
  })
);

router.get(
  "/direct_logout/:number",
  commonResolver.bind({
    modelService: directLogOut,
    isRequestValidateRequired: false,
  })
);

module.exports = router;
