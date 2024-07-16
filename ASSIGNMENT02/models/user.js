//user.js model

const mongoose = require("mongoose");
// Take the out of the box functionality from the plm package to extend the user model
const plm = require("passport-local-mongoose");

const dataSchemaObj = {
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
    required: false,
  },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  status:  {
    type: String,
    enum: ["good", "banned", "suspended"],
    default: "good",
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastSignIn: {
    type: Date,
    default: Date.now,
  },
  apiCalls: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
};
const mongooseSchema = new mongoose.Schema(dataSchemaObj);
// Use passport-local-mongoose to indicate this is a special authentication model
// plugin() adds plm functionality to model
// i.e. hashing/salting password, and handling authentication attempts
mongooseSchema.plugin(plm);
// export the enhanced model
module.exports = new mongoose.model("User", mongooseSchema);
