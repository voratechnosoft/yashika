require("dotenv").config({ path: "./.env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./db/index");
const { failAction } = require("./utils/response");

const http = require("http");
const logger = require("morgan");
const helmet = require("helmet");

const routes = require("./api");

const port = process.env.PORT ? process.env.PORT : 7000;
const app = express();

app.use(express.static("public"));

app.use(helmet());

// Access-Control-Allow-Origin
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(logger("dev"));

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

// app.use(express.static(path.join(process.cwd(), "public")));

app.use("/views", express.static("/views"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api", routes);

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res
      .status(400)
      .json(failAction(err.error.message.toString().replace(/[\""]+/g, "")));
  } else {
    // pass on to another error handler
    next(err);
  }
});

app.get("/", (req, res) => res.send(`<h1>Yashika App devlop environment</h1>`));
app.get("/test-url", (req, res) =>
  res.send(`<h1>Yashika App Work Complete In Live URL</h1>`)
);

const server = http.createServer(app);
server.listen(port, function () {
  console.log(`Express server listening on port ${port}`);
});
