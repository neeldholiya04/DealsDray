const express = require("express");
const User = require("../models/userModel");
const Login = require("../models/loginModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");


const handleErrors = (res, error, customMessage = "Internal Server Error") => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: customMessage,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile_no, role, designation, gender, course, img_link, username, password } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and role are required fields",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const newUser = new User({
      name,
      email,
      mobile_no,
      role,
      designation,
      gender,
      course,
      img_link,
    });

    const savedUser = await newUser.save();

    if (role === 'admin') {
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required for admin registration",
        });
      }

      const usernameExist = await Login.findOne({ userName: username });
      if (usernameExist) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const lastLoginEntry = await Login.findOne().sort({ sno: -1 });
      const sno = lastLoginEntry ? lastLoginEntry.sno + 1 : 1;

      const newLogin = new Login({
        sno,
        userName: username,
        password: hashedPassword,
        user: savedUser._id,
      });

      await newLogin.save();
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    handleErrors(res, error, "Error during user registration");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const loginUser = await Login.findOne({ userName: username });
    if (!loginUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, loginUser.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = jwt.sign(
      { userId: loginUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: accessToken,
    });
  } catch (error) {
    handleErrors(res, error, "Error during login");
  }
});

router.get("/employees", async (req, res) => {
  try {
    const employees = await User.find().select('-__v');
    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    handleErrors(res, error, "Error fetching employees");
  }
});

router.delete("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (deletedUser.role === 'admin') {
      await Login.findOneAndDelete({ user: id });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    handleErrors(res, error, "Error deleting employee");
  }
});

router.put("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    handleErrors(res, error, "Error updating employee");
  }
});

router.get("/search/:username", authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    const loginDetails = await Login.findOne({ userName: username }).populate("user");

    if (!loginDetails || !loginDetails.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { user } = loginDetails;
    const response = {
      username: loginDetails.userName,
      userDetails: {
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
        role: user.role,
        designation: user.designation,
        gender: user.gender,
        course: user.course,
        img_link: user.img_link,
        create_date: user.create_date,
      }
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    handleErrors(res, error, "Error searching for user");
  }
});

module.exports = router;