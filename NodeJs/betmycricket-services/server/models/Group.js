import mongoose from "mongoose";
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
import { userSchema } from "./User";

let groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true
  },
  groupCode: {
    type: String,
    unique: true,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  /*users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],*/
  users: [
    {
      isAdmin: {
        type: Boolean,
        default: false
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],
  defaultCredits: {
    type: Number,
    min: 100,
    max: 999999999
  }
});

function validateGroupId(group) {
  const schema = {
    _id: Joi.string().required()
  };

  return Joi.validate(group, schema);
}

let group = mongoose.model("Group", groupSchema);

exports.Group = group;
exports.groupSchema = groupSchema;
exports.validateGroupId = validateGroupId;
