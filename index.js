const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser"); // For send data from client to server
const morgan = require("morgan"); // For Show log request
require("dotenv").config(); // Import Dotenv for save global variable
const { readdirSync } = require("fs"); // Read Directory

// import to Database
const connectDB = require("./config/dbconnection");

const app = express();

// Connection to DB
connectDB();

//Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" })); //Set limit send file to server
app.use(cors()); //For Allow Get api request from another website
// app.use(express.static(path.join(__dirname, "uploads")));
//access can get public file
app.use("/uploads", express.static(path.resolve(__dirname + "/uploads")));

//========== Route loop ============
// http://localhost:3000/api
readdirSync("./routes").map((file) => {
  app.use("/api", require("./routes/" + file));
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
