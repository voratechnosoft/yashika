/* -----------------------------------------------------------------------
   * @ description : Main module to include all the messages used in project.
----------------------------------------------------------------------- */

module.exports = {
  accept: "Accepted",
  confirm: "Confirmed",
  success: "Success!",
  systemError: "Technical error ! Please try again later.",
  unauthorizedUser: "You are not an authorized user for this action.",
  unauthorizedAdmin: "You are not an authorized to add for this action.",

  unexpectedError:
    "An unexpected network error occurred, please try again later.",
  invalidEndpointOrMethod: "Please enter valid endpoint.",
  unexpectedDataError: "Something went Wrong, please try again later.",

  recordUpdated: "Record updated.",
  recordNotFound: "Record not found!",

  adminNotFound: "Invalid Admin.",
  userNotFound: "Invalid User.",
  catalogNotFound: "Invalid Catalog.",
  oldPasswordNotMatch: "Invalid old password.",
  newPasswordMatchOldPassword: "New password cannot be the same as the old password.",

  mobileAndMessageRequired: "Message and Mobile Number required",
  otpSendError: "Otp Send fail",

  // User
  supplierAlreadyExists: "Supplier is already registered with you.",

  emailNotExists: "This Email is not registered with us.",
  userNotExists: "This User is not exists.",
  tokenInExpire: "You were logged out due to inactivity",
  tokenExpire: "Your session is Expire",

  emailAlreadyExists:
    "This email is already used. Please try with another email.",
  nameAlreadyExists: "Name already exists!",
  mobileAlreadyExists: "Mobile Number already exists!",
  userEmailAlreadyVerified: "User email already verified.",
  otpExpired: "OTP is expired. Please Re-send OTP.",

  invalidMobile: "Mobile Number is incorrect",
  invalidEmail: "Email is incorrect",
  invalidCredentials: "Invalid credentials",
  isUserActive: "This Number Already Active",
  isAccountSuspended: "Your account is suspended. Please contact support",
  isUserBlock: "Your Number is Blocked/Deactivate, Please Contact Our Admin",
  invalidOTP: "Incorrect OTP. Try again.",
  invalidApkType: "Please Enter Valid Apk Type",
  newPasswordMustBeDifferentFromCurrent: "Your new password must be different from your current password",

  // Admin
  adminAlreadyExists: "Only One Admin Added.",
  invalidAdminCredentials: "Invalid credentials. Please try again.",

  groupAlreadyExists: "Group Name is already exit.",
  categoryAlreadyExists: "Category Name is already exit.",
  workingTimeAlreadyExists: "Working Time already exits.",
  roleNameAlreadyExists: "This Role already exits.",
  plainMeterAlreadyExists: "Plain Meter is already exits.",
  fabricQualityAlreadyExists: "Fabric Quality is already exits.",
  dailyUpdateAlreadyExists: "Daily Update is already exits.",
  catalogAlreadyExists: "Cata log is already exits.",
  designNumberAlreadyExists: "This Design Number is already exits.",
  barcodeNotDetected: "Barcode not detected",
  embroideryWorkHeightAlreadyExists: "Embroidery Work Height is already exits.",
  fusiontAlreadyExists: "Fusion is already exits.",
  machineConditionAlreadyExists: "Machine Condition is already exits.",
  productAlreadyExists: "Product is already exits.",
  workernameAlreadyExists: "Worker Name already exists!",
  workingDayAlreadyExists: "Working Day already exists!",

  catalogNotPermission: "You have Not Catalog Permission!",
  dailyUpdateNotPermission: "You have Not Daily Update Permission!",
  machineNotPermission: "You have Not Machine Permission!",
  reportNotPermission: "You have Not Report Permission!",

  machineNotDelete: "You are not delete this Machine to added another action.",
  workerNotDelete: "You are not delete this Worker to added another action.",
  fabricNotDelete: "You are not delete this Fabric to added another action.",
  embroideryWorkHeightNotDelete:
    "You are not delete this Embroidery Work Height to added another action.",
  plainMeterNotDelete:
    "You are not delete this Plain Meter to added another action.",
  groupNotDelete: "You are not delete this Group to added another action.",
  fusionNotDelete: "You are not delete this Fusion to added another action.",
  categoryNotDelete:
    "You are not delete this Category to added another action.",
  userNotDelete: "You are not delete this User to added another action.",

  invalidMachineData: "Invalid Selected Machine.",
};
