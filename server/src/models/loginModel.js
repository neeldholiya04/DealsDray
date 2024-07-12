const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  sno: {
    type: Number,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Login = mongoose.models.Login || mongoose.model("Login", loginSchema);

module.exports = Login;
