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
      // itinerary
      title_itinerary,
      accommodations_itinerary,
      meals_itinerary,
      must_try_itinerary,
      content_itinerary,
      // pocket_summary
      title_pocket,
      activities_pocket,
      where_to_stay_pocket,
      meals_pocket,
      booking_policy,
      enabled,
    } = req.body;

    const files1 = req.files["cover"];
    const files2 = req.files["cover_itinerary"];

    // console.log("Body = ", req.body);
    // console.log("File = ", req.files);
    // console.log("File1 = ", files1);
    // console.log("File2 = ", files2);

    let ItineraryArray = [];
    for (let index = 0; index < title_itinerary.length; index++) {
      ItineraryArray.push({
        title_itinerary: title_itinerary[index],
        cover_itinerary: files2[index],
        accommodations_itinerary: accommodations_itinerary[index],
        meals_itinerary: meals_itinerary[index],
        must_try_itinerary: must_try_itinerary[index],
        content_itinerary: content_itinerary[index],
      });
    }

    let PocketArray = [];
    for (let index = 0; index < title_pocket.length; index++) {
      PocketArray.push({
        title_pocket: title_pocket[index],
        activities_pocket: activities_pocket[index],
        where_to_stay_pocket: where_to_stay_pocket[index],
        meals_pocket: meals_pocket[index],
      });
    }

    console.log("ItineraryArray = ", ItineraryArray);
    console.log("PocketArray = ", PocketArray);

    // if (!files1 && files2) {
    //   return res.status(404).send({
    //     message: "Not Found Images",
    //     status: 404,
    //   });
    // }

    // let package = new Package({
    //   cover,
    //   title,
    //   price,
    //   duration_tour,
    //   start_tour,
    //   end_tour,
    //   meals_tour,
    //   cities_tour,
    //   min_tour,
    //   max_tour,
    //   trip_overview,
    //   recommend_for,
    //   itinerary,
    //   pocket_summary,
    //   booking_policy,
    //   enabled,
    // });

    // if (enabled) {
    //   package.enabled = req.body.enabled;
    // }

    // if (!package) {
    //   return res.status(404).send({
    //     message: "Not Found Any Data",
    //     status: 404,
    //   });
    // }

    // await package.save(); // Save to database

    // res.status(201).send({
    //   message: "Insert Product Successfully",
    //   status: 201,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};
