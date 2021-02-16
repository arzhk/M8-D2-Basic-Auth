const express = require("express");
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

userRouter.put("/me", basicAuth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  updates.forEach((update) => (req.user[update] = req.body[update]));
  await req.user.save();
  res.send("Successfully updated information");
  try {
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/me", basicAuth, async (req, res, next) => {
  try {
    await userSchema.findByIdAndDelete(req.user);
    res.send("Successfully deleted user");
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
