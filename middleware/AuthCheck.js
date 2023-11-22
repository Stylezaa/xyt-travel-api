const jwt = require("jsonwebtoken");
const User = require("../models/user");
// Variable
const SECRET_KEY = process.env.JWT_SECRET;

exports.auth = (req, res, next) => {
  try {
    const token = req.headers["xyttoken"];

    if (!token) {
      return res.status(401).send({
        message: "No token, authorization denied",
        status: 401,
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY); // Decode Token to human language
    req.user = decoded.user;
    next(); //Process next to Controller
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Token Invalid",
      status: 500,
    });
  }
};

exports.AdminCheck = async (req, res, next) => {
  try {
    const { username } = req.user; //req.user get from auth middleware
    const AdminUser = await User.findOne({ username }).exec();

    if (AdminUser.role === "Admin") {
      next(); //Process next to Controller
    } else {
      res.status(401).send({
        message: "Admin Access denied",
        status: 401,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Admin Access denied",
      status: 500,
    });
  }
};

exports.StaffCheck = async (req, res, next) => {
  try {
    const { username } = req.user; //req.user get from auth middleware
    const StaffUser = await User.findOne({ username }).exec();

    if (StaffUser.role === "Staff") {
      next(); //Process next to Controller
    } else {
      res.status(401).send({
        message: "Staff Access denied",
        status: 401,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Staff Access denied",
      status: 500,
    });
  }
};
