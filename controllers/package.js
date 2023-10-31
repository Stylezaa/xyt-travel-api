const Package = require("../models/package");

exports.GetPackageAll = async (req, res) => {
  try {
    let package = await Package.find().sort({ createdAt: -1 }).exec();

    if (package.length === 0) {
      return res.status(404).send({
        message: "Not Found Any Package",
        status: 404,
      });
    }

    res.status(200).send({
      message: package,
      status: 200,
    });
  } catch (error) {
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};

exports.GetPackageByID = async (req, res) => {
  try {
    const { id } = req.params;
    let packageOne = await Package.findById(id).exec();
    if (!packageOne) {
      return res.status(404).send({
        message: "Not Found This Package",
        status: 404,
      });
    }
    res.status(200).send({
      message: packageOne,
      status: 200,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
      status: 500,
    });
  }
};

exports.Insert = async (req, res) => {
  try {
    const {
      cover,
      title,
      price,
      duration_tour,
      start_tour,
      end_tour,
      meals_tour,
      cities_tour,
      min_tour,
      max_tour,
      trip_overview,
      recommend_for,
      itinerary,
      pocket_summary,
      booking_policy,
      enabled,
    } = req.body;

    const files1 = req.files["cover_package"];
    const files2 = req.files["cover_itinerary"];
    if (!files1 && files2) {
      return res.status(404).send({
        message: "Not Found Images",
        status: 404,
      });
    }

    let package = new Package({
      cover,
      title,
      price,
      duration_tour,
      start_tour,
      end_tour,
      meals_tour,
      cities_tour,
      min_tour,
      max_tour,
      trip_overview,
      recommend_for,
      itinerary,
      pocket_summary,
      booking_policy,
      enabled,
    });

    if (enabled) {
      package.enabled = req.body.enabled;
    }

    if (!package) {
      return res.status(404).send({
        message: "Not Found Any Data",
        status: 404,
      });
    }

    await package.save(); // Save to database

    res.status(201).send({
      message: "Insert Product Successfully",
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
