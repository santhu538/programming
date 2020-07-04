const winston = require("winston");
const express = require("express");
const app = express();

require("./server/startup/logging")();
require("./server/startup/routes")(app);
require("./server/startup/db")();
require("./server/startup/config")();
//require("./startup/validation")();

const port = process.env.PORT || 9090;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
// set up route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "BetMyCricket services"
  });
});

/*app.get("/authorise", (req, res) => {
  const token = req.header("Authorization");
  console.log("Got access token " + token);
  res.status(200).json({
    message: "Got your token " + token + ". Thanks dude."
  });
});*/

/*https.createServer(options, app).listen(443);*/
