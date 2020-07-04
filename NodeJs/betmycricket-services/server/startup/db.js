const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

// set up mongoose

// Retry connection
const connectWithRetry = () => {
  winston.info("MongoDB connection with retry");
  const db = config.get("db");
  return mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

// Exit application on error
mongoose.connection.on("error", err => {
  winston.info(`MongoDB connection error: ${err}`);
  setTimeout(connectWithRetry, 5000);
  // process.exit(-1)
});

mongoose.connection.on("connected", () => {
  winston.info(`Mongo DB connected...`);
});

module.exports = function() {
  connectWithRetry();
};
