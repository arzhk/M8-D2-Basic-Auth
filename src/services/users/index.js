const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("./schema");
const { basicAuth, adminAuth } = require("../authTools");

const userRouter = express.Router();

userRouter.get("/", basicAuth, adminAuth, async (req, res, next) => {
  try {
    const users = await userSchema.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);
    await newUser.save();
    res.status(201).send("Successfully registered.");
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
