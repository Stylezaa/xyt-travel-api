const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Variable
const SECRET_KEY = process.env.JWT_SECRET;

exports.CheckHealth = async (req, res) => {
  res.status(200).send({
    message: "Authentication Route is working...",
    status: 200,
  });
};

exports.GetAllUsers = async (req, res) => {
  try {
    const user = await User.find({}).exec();
    if (user.length === 0) {
      return res.status(404).send({
        message: "Not Found Any User",
        status: 404,
      });
    }
    res.status(200).send({
      message: user,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};

exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //Find User and update timestamp for show last login

    const user = await User.findOneAndUpdate({ username }, { new: true });

    const basePath = `${req.protocol}://${req.get("host")}/uploads/profiles/`;

    if (user && user.enabled === true) {
      //Check Password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send({
          message: "ຊື່ ຫຼື ລະຫັດຜ່ານຂອງທ່ານບໍ່ຖືກຕ້ອງ",
          status: 400,
        });
      }

      //Payload
      const payload = {
        user: {
          id: user._id,
          username: user.username,
          f_name: user.f_name,
          l_name: user.l_name,
          profile_img: user.profile_img,
          phone_number: user.phone_number,
          email: user.email,
          role: user.role,
          file_url: basePath,
        },
      };

      //Generate Token
      jwt.sign(
        payload,
        SECRET_KEY,
        {
          expiresIn: "7d",
        },
        (err, token) => {
          if (err) throw err;
          res.send({ token, payload });
        }
      );
    } else {
      return res.status(400).send({
        message: "ຊື່ ຫຼື ລະຫັດຜ່ານຂອງທ່ານບໍ່ຖືກຕ້ອງ",
        status: 400,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};

exports.GetProfile = async (req, res) => {
  try {
    // console.log(req.user) // req.user get from middleware for decode from xyauthtoken
    const user = await User.findOne({ email: req.user.email })
      .select("-password")
      .exec();

    const basePath = `${req.protocol}://${req.get("host")}/uploads/profiles/`;

    if (!user) {
      return res.status(404).send({
        message: "Not Found This User",
        status: 404,
      });
    }

    res.status(200).send({
      message: user,
      file_url: basePath,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};
