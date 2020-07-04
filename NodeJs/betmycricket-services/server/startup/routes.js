const express = require("express");
const schedule = require("../routes/schedule");
const user = require("../routes/user");
const group = require("../routes/group");
const error = require("../middleware/error");
const teams = require("../routes/teams");
const ratio = require("../routes/ratio");
const game = require("../routes/game");
const results = require("../routes/results");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/schedule", schedule);
  app.use("/api/user", user);
  app.use("/api/group", group);
  app.use("/api/teams", teams);
  app.use("/api/ratio", ratio);
  app.use("/api/ratio", ratio);
  app.use("/api/game", game);
  app.use("/api/results", results);
  app.use(error);
};
