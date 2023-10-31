const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.CheckHealth = async (req, res) => {
  res.status(200).send({
    message: "Authentication Route is working...",
    status: 200,
  });
};

exports.GetAllUsers = async (req, res) => {
  try {
    const user = await User.find({}).exec();
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

exports.Register = async (req, res) => {
  try {
    const { f_name, l_name, phone_number, email, password, role, enabled } =
      req.body;

    console.log(req.body);

    let phoneCheck = await User.findOne({ phone_number });
    let emailCheck = await User.findOne({ email });
    if (phoneCheck || emailCheck) {
      return res.status(400).send({
        message: "ມີເບີໂທ ຫຼື ອີເມວ ຜູ້ໃຊ້ງານນີ້ແລ້ວ",
        status: 404,
      });
    }

    const salt = await bcrypt.genSalt(10); //Generate random string for add to hash password
    let user = new User({
      f_name,
      l_name,
      phone_number,
      email,
      password,
      role,
      enabled,
    });

    // Encrypt Password
    user.password = await bcrypt.hash(password, salt); // Hash password
    await user.save(); // Save to database

    res.status(201).send({
      message: "Register User Successfully",
      status: 201,
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
    const { phone_number, email, password } = req.body;
    //Find User and update timestamp for show last login
    let user;
    let ErrorMessage;
    if (phone_number) {
      user = await User.findOneAndUpdate({ phone_number }, { new: true });
      ErrorMessage = "ເບີໂທ ຫຼື ລະຫັດຜ່ານຂອງທ່ານບໍ່ຖືກຕ້ອງ";
    } else {
      user = await User.findOneAndUpdate({ email }, { new: true });
      ErrorMessage = "ອີເມລ ຫຼື ລະຫັດຜ່ານຂອງທ່ານບໍ່ຖືກຕ້ອງ";
    }

    if (user && user.enabled === true) {
      //Check Password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send({
          message: ErrorMessage,
          status: 400,
        });
      }

      //Payload
      const payload = {
        user: {
          id: user._id,
          f_name: user.f_name,
          l_name: user.l_name,
          profile_img: user.profile_img,
          phone_number: user.phone_number,
          email: user.email,
          role: user.role,
        },
      };

      //Generate Token
      jwt.sign(
        payload,
        "jwtSecret",
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
        message: ErrorMessage,
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
      .populate("wishlist")
      .exec();
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
