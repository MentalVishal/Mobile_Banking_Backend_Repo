const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    mobile: Number,
    balance: Number,
    pin: String,
    transactions: [
      {
        amount: Number,
        transType: String,
        description: String,
        date: { type: Date, default: Date() },
      },
    ],
    role: { type: String, default: "User" },
  },
  { versionKey: false }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
