const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const apiRoutes = require("./routes/api.js");

// Set up port and db to work with Heroku as well
const PORT = process.env.PORT || 8000;
const MONGODB = process.env.MONGODB_URI || "mongodb://localhost/budget";

// Configure express app server
const app = express();
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to mongo database 
mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});


// Configure routes
app.use(apiRoutes);

// Start the server and listen for connections
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});