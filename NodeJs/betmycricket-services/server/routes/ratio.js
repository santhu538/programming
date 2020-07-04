const express = require("express");
const router = express.Router();
import { Ratio } from "../models/Ratio";

router.get("/", async (req, res) => {
  let ratios = await Ratio.find();
  res.status(200).send(ratios);
});

router.put("/", async (req, res) => {
  Ratio.findOneAndUpdate(
    { matchId: req.body.matchId, groupId: req.body.groupId },
    {
      $set: {
        team1Ratio: req.body.team1Ratio,
        team2Ratio: req.body.team2Ratio
      }
    },
    {
      new: true,

      upsert: true
    },
    (err, ratioDB) => {
      if (err) {
        console.log("error ", err);
        res.status(500).json({
          success: false,
          message: "Failed to update Ratio",
          error: err.message
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Ratio updated successfully",
          ratio: ratioDB
        });
      }
    }
  );
});

module.exports = router;
