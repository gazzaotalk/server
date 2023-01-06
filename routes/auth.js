const express = require("express");
const User = require("../models/User");
const JwtService = require("../services/jwt-service");

const auth = express.Router();

auth.post("/register", async (req, res) => {
  const { username, password, birthday } = req.body;

  const createdUser = await User.create({ username, password, birthday })
    .lean()
    .exec();
  res.status(201).json(createdUser);
});

auth.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ name: username, password }).exec();
  const rawToken = JwtService.sign(user);

  res
    .cookie("token", rawToken, {
      httpOnly: true,
    })
    .json({
      message: "Access Token이 발급되었습니다.",
    });
});

module.exports = auth;
