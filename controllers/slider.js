const Slider = require("../models/slider");

exports.GetAllSlider = async (req, res) => {
  try {
    const data = await Slider.find().sort({ createdAt: -1 });

    if (data.length === 0) {
      return res.status(404).send({
        message: "Not Found This Item",
        status: 404,
      });
    }

    const basePath = `${req.protocol}://${req.get("host")}/uploads/sliders/`;

    res.status(200).send({
      message: {
        images: data,
        url: basePath,
      },
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

exports.GetSliderByID = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Slider.findById(id).sort({ createdAt: -1 });

    if (!data) {
      return res.status(404).send({
        message: "Not Found This Item",
        status: 404,
      });
    }

    const basePath = `${req.protocol}://${req.get("host")}/uploads/sliders/`;

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

exports.Insert = async (req, res) => {
  try {
    const { enabled } = req.body;

    const files = req.files["images"];
    console.log(files);
    if (!files) {
      return res.status(404).send({
        message: "Not Found Images",
        status: 404,
      });
    }

    let imagePaths = [];

    if (files) {
      files.map((file) => {
        imagePaths.push(`${file.filename}`);
      });
    }

    let slider = new Slider({
      images: imagePaths,
    });

    if (enabled) {
      slider.enabled = req.body.enabled;
    }

    if (!slider) {
      return res.status(404).send({
        message: "Not Found Any Data",
        status: 404,
      });
    }

    await slider.save(); // Save to database

    res.status(201).send({
      message: "Insert Slider Successfully",
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

exports.Update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { enabled } = req.body;

    const files = req.files["images"];

    if (!files) {
      return res.status(404).send({
        message: "Not Found Images",
        status: 404,
      });
    }

    let imagePaths = [];

    if (files) {
      files.map((file) => {
        imagePaths.push(`${file.filename}`);
      });
    }

    // check id has found ?
    const existSlider = await Slider.findById(id);
    if (!existSlider) {
      return res.status(503).send({
        message: "This ID Not Found",
        status: 503,
      });
    }

    await Slider.updateOne(
      {
        _id: id,
      },
      {
        images: imagePaths,
      }
    );

    if (enabled) {
      Slider.enabled = req.body.enabled;
    }

    res.status(200).send({
      message: "Update This Slider Successfully",
      status: 200,
    });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};
