// Model
const Category = require("../models/category");

exports.GetsCategories = async (req, res) => {
  try {
    let data = await Category.find().sort({ createdAt: -1 });

    if (data.length === 0) {
      return res.status(404).json({
        message: "ບໍ່ພົບປະເພດສິນຄ້າ",
        status: 404,
      });
    }

    res.status(200).send({
      message: data,
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

exports.GetCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const CategoryOne = await Category.findById(id);

    if (CategoryOne === null) {
      return res.status(404).json({
        message: "ບໍ່ພົບປະເພດສິນຄ້າ",
        status: 404,
      });
    }

    res.status(200).send({
      message: CategoryOne,
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

exports.InsertCategory = async (req, res) => {
  try {
    const { cate_name } = req.body;
    //check exist Category cate_name
    const ExistCategory = await Category.exists({
      cate_name: cate_name,
    });
    if (ExistCategory) {
      return res.status(409).json({
        message: "ຊື່ປະເພດສິນຄ້ານີ້ມີຢູ່ແລ້ວ",
        status: 409,
      });
    } else {
      let CategoryData = new Category({
        cate_name: cate_name,
      });

      await CategoryData.save();

      res.status(201).json({
        message: "ເພີ່ມປະເພດສິນຄ້າສໍາເລັດ",
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

exports.UpdateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { cate_name } = req.body;

    // Check ID has found ?
    const ExistCategory = await Category.findById(id);
    if (!ExistCategory) {
      return res.status(404).send({
        message: "ບໍ່ພົບປະເພດສິນຄ້ານີ້",
        status: 404,
      });
    }

    await Category.updateOne(
      {
        _id: id,
      },
      {
        cate_name: cate_name,
      }
    );

    res.status(200).json({
      message: "ອັບເດດປະເພດສິນຄ້ານີ້ສໍາເລັດ",
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

exports.DeleteCategoryByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ExistCategory = await Category.findById(id);
    if (!ExistCategory) {
      return res.status(404).json({
        message: "ບໍ່ພົບປະເພດສິນຄ້ານີ້",
        status: 404,
      });
    } else {
      await Category.deleteOne({ _id: id });

      res.status(200).json({
        message: "ລົບປະເພດສິນຄ້ານີ້ສໍາເລັດ",
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
