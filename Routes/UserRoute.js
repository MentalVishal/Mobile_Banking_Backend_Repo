const express = require("express");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const userModel = require("../Model/UserModel");
require("dotenv").config();

const userRoute = express.Router();

userRoute.post("/register", async (req, res) => {
  try {
    const { email, name, password, mobile, balance, pin } = req.body;
    const isUser = await userModel.findOne({ email });
    if (isUser) {
      res.status(400).json({ msg: "User Already Exist" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(404).json({ err: err });
        } else {
          const user = new userModel({
            email,
            name,
            password: hash,
            mobile,
            balance,
            pin,
          });
          await user.save();
          res.status(200).json({ msg: "Register Sucessful", User: user });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          jwt.sign(
            { userID: user._id, userName: user.name, role: user.role },
            process.env.secrete,
            { expiresIn: "7d" },
            (err, token) => {
              if (token) {
                res.json({
                  msg: "User login Sucessfull",
                  Token: token,
                  User: user,
                });
              } else {
                res.json({ err: err.message });
                return;
              }
            }
          );
        } else {
          res.json({ msg: "Invalid Credentials." });
          return;
        }
      });
    } else {
      res.json({ msg: "User doesnt exist, please register." });
      return;
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = {
  userRoute,
};
