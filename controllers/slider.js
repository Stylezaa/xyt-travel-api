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
    const { images, images_index } = req.body;
    const files = req.files["images"] || null;

    // Check ID has found ?
    const ExistSlider = await Slider.findById(id);
    if (!ExistSlider) {
      return res.status(404).send({
        message: "ບໍ່ພົບ Slider ນີ້",
        status: 404,
      });
    }

    let ImagesArray = [];
    if (files?.length > 0) {
      if (typeof images === "object") {
        for (let index = 0; index < files?.length; index++) {
          images.splice(
            parseInt(images_index[index]),
            0,
            files[index]?.filename
          );
        }

        for (let index = 0; index < images.length; index++) {
          ImagesArray.push(images[index]);
        }
      }
      if (typeof images === "string") {
        ImagesArray.splice(0, 0, images);
        for (let index = 0; index < files.length; index++) {
          ImagesArray.push(files[index].filename);
        }
      } else if (!images) {
        for (let index = 0; index < files?.length; index++) {
          ImagesArray.push(files[index].filename);
        }
      }
    } else if (!files) {
      if (typeof images === "string") {
        ImagesArray.push(images);
      } else if (typeof images === "object") {
        for (let index = 0; index < images?.length; index++) {
          ImagesArray.push(images[index]);
        }
      }
    }
    await Slider.updateOne(
      {
        _id: id,
      },
      {
        images: ImagesArray,
      }
    );

    res.status(200).send({
      message: "Update This Slider Successfully",
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
