//jshint esversion:6

const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");
  findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);