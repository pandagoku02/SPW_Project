const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required:[true, "Username is required"],
      
    },
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
     

    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
     
      
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password should have minimum length of 8 characters."],
     
    
    },
    role: {
      type: String,
      enum: ["Associate", "Admin"],
      default: "Associate",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
