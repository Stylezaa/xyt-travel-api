const Package = require("../models/package");

exports.GetPackageAll = async (req, res) => {
  try {
    let package = await Package.find()
      .populate({ path: "users_booking" })
      .populate({ path: "category" })
      .sort({ createdAt: -1 });

    const basePath = `${req.protocol}://${req.get("host")}/uploads/packages/`;

    if (package.length === 0) {
      return res.status(404).send({
        message: "Not Found Any Package",
        status: 404,
      });
    }

    res.status(200).send({
      message: package,
      url: basePath,
      status: 200,
    });
  } catch (error) {
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};

exports.GetPackageByCate = async (req, res) => {
  try {
    const { category } = req.query;
    let package = await Package.find()
      .populate({
        path: "users_booking",
      })
      .populate({
        path: "category",
        match: {
          cate_name: category,
        },
      })
      .sort({ createdAt: -1 })
      .then((data) => {
        return data.filter((parent) => parent.category !== null);
      });

    const basePath = `${req.protocol}://${req.get("host")}/uploads/packages/`;

    if (package.length === 0) {
      return res.status(404).send({
        message: "Not Found Any Package",
        status: 404,
      });
    }

    res.status(200).send({
      message: package,
      url: basePath,
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
    const { title } = req.params;
    let packageOne = await Package.findOne({ title: title })
      .populate("users_booking")
      .populate({ path: "category" })
      .exec();
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
      title,
      price,
      duration_tour,
      category,
      start_tour,
      end_tour,
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

    const files1 = req.files["cover"][0];
    const files2 = req.files["cover_itinerary"];

    if (!files1 || files2.length === 0) {
      return res.status(404).send({
        message: "ໄຟຮຮູບພາບບໍ່ຄົບຖ້ວນ",
        status: 404,
      });
    }

    let ItineraryArray = [];
    for (let index = 0; index < files2.length; index++) {
      ItineraryArray.push({
        title_itinerary: title_itinerary[index],
        cover_itinerary: files2[index].filename,
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

    let package = new Package({
      title,
      price,
      category,
      duration_tour,
      start_tour,
      end_tour,
      cities_tour,
      min_tour,
      max_tour,
      trip_overview,
      recommend_for,
      booking_policy,
      enabled,
    });

    await package.save(); // Save to database

    if (enabled) {
      package.enabled = req.body.enabled;
    }

    if (files1) {
      await Package.updateOne(
        {
          _id: package._id,
        },
        {
          cover: files1.filename,
        }
      );
    }

    if (Array.isArray(title_itinerary)) {
      for (let index = 0; index < title_itinerary.length; index++) {
        await Package.updateOne(
          {
            _id: package._id,
          },
          {
            itinerary: ItineraryArray,
          }
        );
      }
    } else {
      let itineraryItem = {
        title_itinerary: title_itinerary,
        accommodations_itinerary: accommodations_itinerary,
        meals_itinerary: meals_itinerary,
        must_try_itinerary: must_try_itinerary,
        content_itinerary: content_itinerary,
        cover_itinerary: files2[0].filename,
      };
      await Package.updateOne(
        {
          _id: package._id,
        },
        {
          itinerary: itineraryItem,
        }
      );
    }

    if (Array.isArray(title_pocket)) {
      for (let index = 0; index < title_pocket.length; index++) {
        await Package.updateOne(
          {
            _id: package._id,
          },
          {
            pocket_summary: PocketArray,
          }
        );
      }
    } else {
      let PocketItem = {
        title_pocket,
        activities_pocket,
        where_to_stay_pocket,
        meals_pocket,
      };
      await Package.updateOne(
        {
          _id: package._id,
        },
        {
          pocket_summary: PocketItem,
        }
      );
    }

    if (!package) {
      return res.status(404).send({
        message: "Not Found Any Data",
        status: 404,
      });
    }

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

exports.UpdatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      price,
      category,
      duration_tour,
      start_tour,
      end_tour,
      cities_tour,
      min_tour,
      max_tour,
      trip_overview,
      recommend_for,
      booking_policy,
      enabled,
    } = req.body;

    const file = req.file;

    // Check ID has found ?
    const ExistPackage = await Package.findById(id);
    if (!ExistPackage) {
      return res.status(404).send({
        message: "ບໍ່ພົບ Package ນີ້",
        status: 404,
      });
    }

    await Package.updateOne(
      {
        _id: id,
      },
      {
        title: title,
        price: price,
        category: category,
        duration_tour: duration_tour,
        start_tour: start_tour,
        end_tour: end_tour,
        cities_tour: cities_tour,
        min_tour: min_tour,
        max_tour: max_tour,
        trip_overview: trip_overview,
        recommend_for: recommend_for,
        booking_policy: booking_policy,
        enabled: enabled,
      }
    );

    if (file) {
      let fileFinal = file.filename;
      await Package.updateOne(
        {
          _id: id,
        },
        {
          cover: fileFinal,
        }
      );
    }

    res.status(200).json({
      message: "ອັບເດດ Package ສໍາເລັດ",
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

exports.DeletePackageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dataOne = await Package.deleteOne({ _id: id });

    if (!dataOne) {
      return res.status(404).send({
        message: "Not Found This Package Item",
        status: 404,
      });
    }

    res.status(200).send({
      message: "Delete This Package Successfully",
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
