// Model
const Activity = require("../models/activity");

exports.GetsActivities = async (req, res) => {
  try {
    let data = await Activity.find().sort({ createdAt: -1 });

    const basePath = `${req.protocol}://${req.get("host")}/uploads/activities/`;

    if (data.length === 0) {
      return res.status(404).json({
        message: "ບໍ່ພົບກິດຈະກໍາ",
        status: 404,
      });
    }

    res.status(200).send({
      message: data,
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

exports.GetsActivitiesPublish = async (req, res) => {
  try {
    let data = await Activity.find({ enabled: true }).sort({ createdAt: -1 });

    const basePath = `${req.protocol}://${req.get("host")}/uploads/activities/`;

    if (data.length === 0) {
      return res.status(404).json({
        message: "ບໍ່ພົບກິດຈະກໍາ",
        status: 404,
      });
    }

    res.status(200).send({
      message: data,
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

exports.GetActivityByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ActivityOne = await Activity.findById(id);

    if (ActivityOne === null) {
      return res.status(404).json({
        message: "ບໍ່ພົບກິດຈະກໍານີ້",
        status: 404,
      });
    }

    res.status(200).send({
      message: ActivityOne,
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

exports.InsertActivity = async (req, res) => {
  try {
    const { title, location, content } = req.body;

    const file = req.file;
    //check exist Activity title
    const ExistActivity = await Activity.exists({
      title: title,
    });
    if (ExistActivity) {
      return res.status(409).json({
        message: "ຊື່ປະເພດສິນຄ້ານີ້ມີຢູ່ແລ້ວ",
        status: 409,
      });
    } else {
      let ActivityData = new Activity({
        title: title,
        location: location,
        content: content,
      });

      await ActivityData.save();

      if (file) {
        let fileFinal = file.filename;
        await Activity.updateOne(
          {
            _id: ActivityData._id,
          },
          {
            cover: fileFinal,
          }
        );
      }

      res.status(201).json({
        message: "ເພີ່ມກິດຈະກໍາສໍາເລັດ",
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

exports.UpdateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, location, content, enabled } = req.body;

    const file = req.file;

    // Check ID has found ?
    const ExistActivity = await Activity.findById(id);
    if (!ExistActivity) {
      return res.status(404).send({
        message: "ບໍ່ພົບກິດຈະກໍານີ້",
        status: 404,
      });
    }

    await Activity.updateOne(
      {
        _id: id,
      },
      {
        title: title,
        location: location,
        content: content,
        enabled: enabled,
      }
    );

    if (file) {
      let fileFinal = file.filename;
      await Activity.updateOne(
        {
          _id: id,
        },
        {
          cover: fileFinal,
        }
      );
    }

    res.status(200).json({
      message: "ອັບເດດກິດຈະກໍານີ້ສໍາເລັດ",
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

exports.DeleteActivityByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ExistActivity = await Activity.findById(id);
    if (!ExistActivity) {
      return res.status(404).json({
        message: "ບໍ່ພົບກິດຈະກໍານີ້",
        status: 404,
      });
    } else {
      await Activity.deleteOne({ _id: id });

      res.status(200).json({
        message: "ລົບກິດຈະກໍານີ້ສໍາເລັດ",
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
