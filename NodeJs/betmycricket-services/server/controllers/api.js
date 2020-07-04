import mongoose from "mongoose";
import Test2 from "../models/test2";
// create new cause
export function createTest2(req, res) {
  const test2 = new Test2({
    _id: mongoose.Types.ObjectId(),
    testobj: [
      {
        title: req.body.title,
        description: req.body.description
      },
      {
        title: req.body.title,
        description: req.body.description
      }
    ],
    description: req.body.description
  });
  return test2
    .save()
    .then(newTest2 => {
      return res.status(201).json({
        success: true,
        message: "New cause created successfully",
        Test2: newTest2
      });
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message
      });
    });
}
