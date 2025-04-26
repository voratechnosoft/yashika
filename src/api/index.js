const { Router } = require("express");
const routeV1 = require("./v1");

const app = Router();

app.use("/v1", routeV1);

module.exports = app;
