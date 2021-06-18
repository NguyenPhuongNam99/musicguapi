const express = require("express");
require("./database/mysql.database");
require("dotenv").config();
const https = require("https");
const fs = require("fs");
const path = require("path");
// var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var cors = require("cors");
const corsOptions = {
  exposedHeaders: "Authorization",
  origin: true, //Chan tat ca cac domain khac ngoai domain nay
  credentials: true, //Để bật cookie HTTP qua CORS
};
const port = process.env.PORT || 3000;
const app = express();
// app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use(
  "/public/images/",
  express.static(path.join(__dirname, "public/images/"))
);
const route = require("./routes/index");

app.use("/", route);

app.use((error, req, res, next) => {
  console.error(error);
  return res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

const sslServer = https.createServer(
  {
    key: fs.readFileSync("/home/troutrous/key.pem"),
    cert: fs.readFileSync("/home/troutrous/cert.pem"),
  },
  app
);

sslServer.listen(port, () => {
  console.log("Server listening on " + sslServer.address().port);
});
