const express = require("express");
const { auth } = require("../Middleware/authMiddleware");
const userModel = require("../Model/UserModel");

const transRoute = express.Router();

transRoute.post("/deposit", auth, async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res
        .status(400)
        .json({ error: "User not found. Please log in again." });
    }

    userData.transactions.push({
      amount: amount,
      transType: "Credit",
      description: description,
    });

    userData.balance = +userData.balance + +amount;

    await userData.save();

    return res
      .status(200)
      .json({ message: "Deposit successful", userData: userData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
transRoute.post("/withdraw", auth, async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res
        .status(400)
        .json({ error: "User not found. Please log in again." });
    }

    userData.transactions.push({
      amount: amount,
      transType: "Debit",
      description: description,
    });

    userData.balance = +userData.balance - +amount;

    await userData.save();

    return res
      .status(200)
      .json({ message: "Withdraw successful", userData: userData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

transRoute.post("/pin", auth, async (req, res) => {
  try {
    const { userId, updatePin } = req.body;
    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res
        .status(400)
        .json({ error: "User not found. Please log in again." });
    }

    userData.pin = updatePin;

    await userData.save();

    return res.status(200).json({ message: "Pin Updated successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = {
  transRoute,
};
