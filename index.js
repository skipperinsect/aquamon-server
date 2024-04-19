const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");

const app = express();

const router = require("./routes/index");

const PORT = process.env.PORT || 5000;
const public = __dirname + "/public/";

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/public/uploads", express.static(path.join(public, "uploads")));

app.use("/", router);

app.get("/", function (req, res) {
  res.sendFile(path.join(public + "index.html"));
});

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));
