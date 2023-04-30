const User = require("../models/User");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcrypt");

module.exports.createUser = async (req, res) => {
  try {
    const { username} = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(200).json({
        success: false,
        message: "Username is already taken!",
      });
    } 
    
    if (!req.body.password) {
      req.body.password = crypto.randomBytes(20).toString("hex");
     }  else if (!validator.isStrongPassword(req.body.password)){
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      } );
    
      } else if (req.body.password !== req.body.confirm_password) {
      return res.status(200).json({
      success: false,
      message: "Password and confirm password should be same!",
      } );
      }
      const salt = bcrypt.genSaltSync(10);
      //hashing
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      const newUser = await User.create({...req.body,password:hashedPassword});
      console.log(newUser);
      //res.cookie("userId", newUser.id);
      return res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  }

  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.createSession = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    }).lean();
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Invalid username/password.",
      });
    }
    // /hash compare
        const checkPassword = await bcrypt.compare(req.body.password, user.password); 
    if (!checkPassword) {
    return res.status(400).json({
    success: false,
     message: "Invalid username or password!",
    });
   }
    const { password, ...otherData } = user;// Exclude password from returned data
    res.cookie("userId", otherData._id);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: otherData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(200).json({
        success: true,
        message: "You have been logged out, please login to continue!",
      });
    }
    const { password, ...otherData } = await User.findById(userId).lean();
    return res.status(200).json({
      success: true,
      data: otherData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "Associate" });
    let allUserDetails = [];
    users.forEach((user) => {
      const { password, ...otherDetails } = user;
      allUserDetails.push(otherDetails._doc);
    });
    console.log(allUserDetails);
    return res.status(200).json({
      success: true,
      data: allUserDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const deleteUserId = req.query.userId;
    await User.findByIdAndDelete(deleteUserId);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const updateUserId = req.body.userId;
    await User.findByIdAndUpdate(updateUserId, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    return res.status(200).json({
      success: true,
      message: "User details updated successfully!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
