const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");

const router = new Router();

// SCHEMA
const loginSchema = require("./login");
const mobileOtpSchema = require("./mobileOtp");

// SERVICES
const onLogin = require("../../../services/auth/login");
const verifyMobileOtp = require("../../../services/auth/verifyMobileOtp");

router.post(
  "/login",
  commonResolver.bind({
    modelService: onLogin,
    isRequestValidateRequired: true,
    schemaValidate: loginSchema,
  })
);

router.post(
  "/verifyMobileOtp",
  commonResolver.bind({
    modelService: verifyMobileOtp,
    isRequestValidateRequired: true,
    schemaValidate: mobileOtpSchema,
  })
);

module.exports = router;
