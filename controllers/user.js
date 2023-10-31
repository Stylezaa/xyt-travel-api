const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.index = async (req, res) => {
  res.status(200).send({
    message: "User Route is working...",
    status: 200,
  });
};

exports.UpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { f_name, l_name, phone_number, email } = req.body;

    const existUser = await User.findById(id);
    if (!existUser) {
      return res.status(503).send({
        message: "This User Not Found",
        status: 503,
      });
    } else {
      await User.updateOne(
        {
          _id: id,
        },
        {
          f_name: f_name,
          l_name: l_name,
          phone_number: phone_number,
          email: email,
        }
      );

      return res.status(200).send({
        message: "Update This User Successfully",
        status: 200,
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

// Update Password
exports.UpdatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { password } = req.body;

    // check id has found ?
    const existUser = await User.findById(id);

    if (!existUser) {
      return res.status(500).send("This User ID not found");
    }

    let UserOne;

    if (password) {
      const salt = await bcrypt.genSalt(5);
      const hashPassword = await bcrypt.hash(password, salt);

      UserOne = await User.updateOne(
        {
          _id: id,
        },
        {
          password: hashPassword,
        }
      );
    }
    if (!UserOne) {
      return res.status(404).send({
        message: "Not Found This User",
        status: 404,
      });
    }

    res.status(200).send({
      message: "Change Password Successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.UpdateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = req.file.filename;
    if (!file) {
      return res.status(404).send({
        message: "Not Found Images",
        status: 404,
      });
    }

    const existUser = await User.findById(id);
    if (!existUser) {
      return res.status(503).send({
        message: "This User Not Found",
        status: 503,
      });
    } else {
      await User.updateOne(
        {
          _id: id,
        },
        {
          profile_img: file,
        }
      );

      return res.status(200).send({
        message: "Update Profile Image Successfully",
        status: 200,
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

exports.UpdateRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { role } = req.body;

    const existUser = await User.findById(id);
    if (!existUser) {
      return res.status(503).send({
        message: "This User Not Found",
        status: 503,
      });
    } else {
      await User.updateOne(
        {
          _id: id,
        },
        {
          role: role,
        }
      );

      return res.status(200).send({
        message: "Update This User Role Successfully",
        status: 200,
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

exports.UpdateBanStatusUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { enabled } = req.body;

    const existUser = await User.findById(id);
    if (!existUser) {
      return res.status(503).send({
        message: "This User Not Found",
        status: 503,
      });
    } else {
      await User.updateOne(
        {
          _id: id,
        },
        {
          enabled: enabled,
        }
      );

      return res.status(200).send({
        message: "Update This User Ban Status Successfully",
        status: 200,
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

exports.DeleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dataOne = await User.deleteOne({ _id: id });

    if (!dataOne) {
      return res.status(404).send({
        message: "Not Found User ID",
        status: 404,
      });
    }

    res.status(200).send({
      message: "Delete User ID Successfully",
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

// Add To WishList
exports.addToWishList = async (req, res) => {
  try {
    //code
    const { productId } = req.body;
    await User.findOneAndUpdate(
      { email: req.user.email },
      { $addToSet: { wishlist: productId } }
    ).exec();

    res.status(201).send({
      message: "Add Product To WishList Successfully",
      status: 201,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
      status: 500,
    });
  }
};
exports.getWishList = async (req, res) => {
  try {
    //code
    let list = await User.findOne({ email: req.user.email })
      .select("wishlist")
      .populate("wishlist")
      .exec();
    res.status(201).send({
      message: list,
      status: 200,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
      status: 500,
    });
  }
};

exports.removeWishListByOne = async (req, res) => {
  try {
    const { productId } = req.params;

    const existUser = await User.findOne({ email: req.user.email });
    if (!existUser) {
      return res.status(503).send({
        message: "This User Not Found",
        status: 503,
      });
    }
    await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { wishlist: productId } }
    ).exec();

    res.status(200).send({
      message: "Remove Product From WishList Successfully",
      status: 200,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
      status: 500,
    });
  }
};

exports.removeWishListAll = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { email: req.user.email },
      { wishlist: [] }
    ).exec();

    res.status(200).send({
      message: "Remove All Product From WishList Successfully",
      status: 200,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
      status: 500,
    });
  }
};
