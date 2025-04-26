const { Router } = require("express");

// Start Permission Middleware//
const userAuthentication = require("../../middleware/authentication/userAuthentication");

// End Permission Middleware //
const authRouter = require("./auth/index");
const adminRouter = require("./admin/index");
const userRouter = require("./user/index");
const machineRouter = require("./machine");

const catalogRouter = require("./catalog");
const groupRouter = require("./group");
const workerRouter = require("./worker");
const workingTimeRouter = require("./workingTime");
const workingDayRouter = require("./workingDay");
const machineConditionRouter = require("./machineCondition");
const fabricRouter = require("./fabric");
const embroideryWorkHeightRouter = require("./embroideryWorkHeight");
const fusionRouter = require("./fusion");
const fabricPannaRouter = require("./fabricPanna");
const fabricPlainIncludedRouter = require("./fabricPlainIncluded");
const plainMeterRouter = require("./plainMeter");
const roleRouter = require("./role");

const sampleInquiryRouter = require("./sampleInquiry/index");
const dailyUpdateRouter = require("./dailyUpdate/index");
const reportsRouter = require("./reports/index");
const notificationRouter = require("./notification/index");
const categoryRouter = require("./category/index");

const app = Router();

/*********** Combine all Routes ********************/

app.use("/auth", authRouter);

app.use("/admin", adminRouter);
app.use("/user", userAuthentication.bind({}), userRouter);

app.use("/user/sampleInquiry", sampleInquiryRouter);

app.use("/admin/machine", userAuthentication.bind({}), machineRouter);
app.use("/admin/category", userAuthentication.bind({}), categoryRouter);

app.use("/admin/catalog", userAuthentication.bind({}), catalogRouter);
app.use("/admin/group", userAuthentication.bind({}), groupRouter);
app.use("/admin/worker", userAuthentication.bind({}), workerRouter);
app.use("/admin/working-time", userAuthentication.bind({}), workingTimeRouter);
app.use("/admin/working-day", userAuthentication.bind({}), workingDayRouter);
app.use(
  "/admin/machine-condition",
  userAuthentication.bind({}),
  machineConditionRouter
);
app.use("/admin/fabric", userAuthentication.bind({}), fabricRouter);
app.use(
  "/admin/embroidery-work-height",
  userAuthentication.bind({}),
  embroideryWorkHeightRouter
);
app.use("/admin/fusion", userAuthentication.bind({}), fusionRouter);
app.use("/admin/fabricPanna", userAuthentication.bind({}), fabricPannaRouter);
app.use(
  "/admin/fabricPlainIncluded",
  userAuthentication.bind({}),
  fabricPlainIncludedRouter
);
app.use("/admin/plain-meter", userAuthentication.bind({}), plainMeterRouter);
app.use("/admin/role", userAuthentication.bind({}), roleRouter);

app.use("/admin/daily-update", userAuthentication.bind({}), dailyUpdateRouter);

// PDF Report Generate
app.use("/admin/report", userAuthentication, reportsRouter);
app.use("/notification", userAuthentication, notificationRouter);

module.exports = app;
