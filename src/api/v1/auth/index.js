const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");

const router = new Router();

// SCHEMA
const registerSchema = require("./register");
const loginSchema = require("./login");
const mobileOtpSchema = require("./mobileOtp");
const emailOtpSchema = require("./emailOtp");
const reSendOtpSchema = require("./reSendOtp");
const forgotPasswordSchema = require("./forgotPassword");
const resetPasswordSchema = require("./resetPassword");

// SERVICES
const onLogin = require("../../../services/auth/login");
const onRegister = require("../../../services/auth/register");
const verifyMobileOtp = require("../../../services/auth/verifyMobileOtp");
const verifyEmailOtp = require("../../../services/auth/verifyEmailOtp");
const onReSendOtp = require("../../../services/auth/reSendOtp");
const onForgotPassword = require("../../../services/auth/forgotPassword");
const onReSetPassword = require("../../../services/auth/resetPassword");

router.post(
  "/register",
  commonResolver.bind({
    modelService: onRegister,
    isRequestValidateRequired: true,
    schemaValidate: registerSchema,
  })
);

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

router.post(
  "/verifyEmailOtp",
  commonResolver.bind({
    modelService: verifyEmailOtp,
    isRequestValidateRequired: true,
    schemaValidate: emailOtpSchema,
  })
);

router.post(
  "/reSendOtp",
  commonResolver.bind({
    modelService: onReSendOtp,
    isRequestValidateRequired: true,
    schemaValidate: reSendOtpSchema,
  })
);

router.post(
  "/forgot-password",
  commonResolver.bind({
    modelService: onForgotPassword,
    isRequestValidateRequired: true,
    schemaValidate: forgotPasswordSchema,
  })
);

router.post(
  "/reset-password",
  commonResolver.bind({
    modelService: onReSetPassword,
    isRequestValidateRequired: true,
    schemaValidate: resetPasswordSchema,
  })
);

module.exports = router;
