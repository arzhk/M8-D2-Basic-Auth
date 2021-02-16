const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is missing."],
    unique: [true, "Username already taken."],
    minLength: [3, "Username is too short (3 characters minimum)."],
  },
  password: {
    type: String,
    required: [true, "Password is missing."],
    minLength: [8, "Password is too short (8 characters minimum)"],
  },
  firstName: {
    type: String,
    required: [true, "First name is missing."],
    minLength: [3, "Name is too short (3 characters minimum)."],
  },
  lastName: {
    type: String,
    required: [true, "Surname is missing."],
    minLength: [3, "Name is too short (3 characters minimum)."],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
  },
});

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return null;
  } else return null;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;
  user.role = "user";
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

module.exports = model("users", userSchema);
