const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.index = async (req, res) => {
  res.status(200).send({
    message: "User Route is working...",
    status: 200,
  });
};

exports.GetsUserForAdmin = async (req, res) => {
  try {
    const user = await User.find({ role: "Staff" }).select("-password").exec();
    if (user.length === 0) {
      return res.status(404).send({
        message: "ບໍ່ພົບຜູ້ໃຊ້ງານ",
        status: 404,
      });
    }

    const basePath = `${req.protocol}://${req.get("host")}/uploads/profiles/`;

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

exports.GetByID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").exec();
    if (user.length === 0) {
      return res.status(404).send({
        message: "ບໍ່ພົບຜູ້ໃຊ້ງານ",
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

exports.InsertUser = async (req, res) => {
  try {
    // Check User have found ?
    const {
      username, // admin
      email, // admin@gmail.com
      password, // 12345678
      role, // Admin
      f_name, // Sin
      l_name, // JR
      phone_number, // 02078172771
    } = req.body;
    const file = req.file.filename;
    if (!file) {
      return res.status(404).send({
        message: "Not Found Images",
        status: 404,
      });
    }
    let usernameCheck = await User.findOne({ username });
    let emailCheck = await User.findOne({ email });
    if (usernameCheck) {
      return res.status(400).send({
        message: "ມີຊື່ຜູ້ໃຊ້ ຫຼື ມີຊື່ອີເມວນີ້ແລ້ວ",
        status: 400,
      });
    } else if (emailCheck) {
      return res.status(400).send({
        message: "ມີຊື່ຜູ້ໃຊ້ ຫຼື ມີຊື່ອີເມວນີ້ແລ້ວ",
        status: 400,
      });
    } else if (password.length < 8) {
      return res.status(400).send({
        message: "ລະຫັດຜ່ານສັ້ນເກີນໄປ ກະລຸນາຕັ້ງ 8 ໂຕຂື້ນໄປ",
        status: 400,
      });
    } else {
      const salt = await bcrypt.genSalt(10); //Generate random string for add to hash password
      let UserData = new User({
        username: username,
        email: email,
        password: password,
        role: role,
        profile_img: file,
        f_name: f_name,
        l_name: l_name,
        phone_number: phone_number,
      });

      // Encrypt Password
      UserData.password = await bcrypt.hash(password, salt); // Hash password
      await UserData.save(); // Save to database

      res.status(201).send({
        message: "ສະໝັກສະມາຊິກສໍາເລັດ",
        status: 201,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};

exports.UpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { email, f_name, l_name, phone } = req.body;

    const file = req.file;

    // Check ID has found ?
    const ExistUser = await User.findById(id);
    if (!ExistUser) {
      return res.status(404).send({
        message: "ບໍ່ພົບຜູ້ໃຊ້ງານນີ້",
        status: 404,
      });
    }

    await User.updateOne(
      {
        _id: id,
      },
      {
        email: email,
        f_name: f_name,
        l_name: l_name,
        phone: phone,
      }
    );

    if (file) {
      let fileFinal = file.filename;
      await User.updateOne(
        {
          _id: id,
        },
        {
          profile_img: fileFinal,
        }
      );
    }

    res.status(200).json({
      message: "ອັບເດດຂໍ້ມູນຜູ້ໃຊ້ງານນີ້ສໍາເລັດ",
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

exports.DeleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findOneAndRemove({ _id: id });
    res.send({
      message: "ລົບຜູ້ໃຊ້ງານນີ້ສໍາເລັດ",
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
