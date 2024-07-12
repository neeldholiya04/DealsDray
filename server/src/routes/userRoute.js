const express = require("express");
const User = require("../models/userModel");
const Login = require("../models/loginModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      mobile_no: req.body.mobile_no,
      role: req.body.role,
      designation: req.body.designation,
      gender: req.body.gender,
      course: req.body.course,
      img_link: req.body.img_link,
    });

    const savedUser = await newUser.save();

    if (req.body.role === 'admin') {
      const usernameExist = await Login.findOne({ userName: req.body.username });
      if (usernameExist) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const lastLoginEntry = await Login.findOne().sort({ sno: -1 });
      const sno = lastLoginEntry ? lastLoginEntry.sno + 1 : 1;

      const newLogin = new Login({
        sno,
        userName: req.body.username,
        password: hashedPassword,
        user: savedUser._id,
      });

      await newLogin.save();
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.dir(req, {depth:null});
    const loginUser = await Login.findOne({ userName: req.body.username });
    console.log("The User found is: " + loginUser);
    if (!loginUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    


    const validPassword = await bcrypt.compare(req.body.password, loginUser.password);
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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/employees", async (req, res) => {
  try {
    const employees = await User.find();
    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


router.delete("/employees/:id", async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (deletedUser.role === 'admin') {
      const deletedLogin = await Login.findOneAndDelete({ userName: deletedUser.username });
      if (!deletedLogin) {
        return res.status(404).json({
          success: false,
          message: "Admin login not found",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.put("/employee/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile_no: req.body.mobile_no,
          role: req.body.role,
          designation: req.body.designation,
          gender: req.body.gender,
          course: req.body.course,
          img_link: req.body.img_link,
        },
      },
      { new: true }
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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});




router.get("/search/:username", authenticateToken, async (req, res) => {
  try {
    const username = req.params.username;
    const loginDetails = await Login.findOne({ userName: username }).populate("user");

    if (!loginDetails || !loginDetails.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const response = {
      username: loginDetails.userName,
      password: loginDetails.password,
      userDetails: {
        name: loginDetails.user.name,
        email: loginDetails.user.email,
        mobile_no: loginDetails.user.mobile_no,
        role: loginDetails.user.role,
        designation: loginDetails.user.designation,
        gender: loginDetails.user.gender,
        course: loginDetails.user.course,
        img_link: loginDetails.user.img_link,
        create_date: loginDetails.user.create_date,
      }
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});







module.exports = router;
