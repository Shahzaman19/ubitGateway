const passport = require("passport");
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const session = require("express-session");
const path = require("path");
// const morgan = require('morgan')
const port = process.env.PORT || 4000;

// app.use(morgan('dev'));
app.use(express.json());
app.use(
  session({
    secret: process.env.PRIVATE_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

//Img Uploader
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//DB
require("./Apps/config/db");



//ROUTES
app.use("/api", require("./Apps/routes/app.routes"));

//PORT
const myServer = server.listen(port, console.log(`Connecte to port ${port}`));

module.exports = {myServer};