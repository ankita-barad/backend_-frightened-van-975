const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "I dont want to specify"],
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
