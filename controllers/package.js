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
      booking_policy,
      enabled,
    });

    await package.save(); // Save to database

    if (enabled) {
      package.enabled = req.body.enabled;
    }

    if (recommend_for) {
      await Package.updateOne(
        {
          _id: package._id,
        },
        { $push: { recommend_for: recommend_for } }
      );
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
      content_itinerary,
      cover_itinerary,
      cover_itinerary_index,

      // pocket_summary
      title_pocket,
      activities_pocket,
      where_to_stay_pocket,
      meals_pocket,

      booking_policy,
      enabled,
    } = req.body;

    const files1 = (req.files["cover"] && req.files["cover"][0]) || null;
    const files2 = req.files["cover_itinerary"] || null;

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
        booking_policy,
        enabled,
      }
    );

    if (files1) {
      await Package.updateOne(
        {
          _id: id,
        },
        {
          cover: files1.filename,
        }
      );
    }

    if (recommend_for) {
      await Package.updateOne(
        {
          _id: id,
        },
        { $push: { recommend_for: recommend_for } }
      );
    }

    if (files2?.length > 0) {
      if (typeof cover_itinerary === "object") {
        console.log("11111");
        let ItineraryArray = [];
        for (let index = 0; index < files2?.length; index++) {
          cover_itinerary.splice(
            parseInt(cover_itinerary_index[index]),
            0,
            files2[index]?.filename
          );
        }
        for (let index = 0; index < title_itinerary.length; index++) {
          ItineraryArray.push({
            title_itinerary: title_itinerary[index],
            cover_itinerary: cover_itinerary[index],
            content_itinerary: content_itinerary[index],
          });
        }

        await Package.updateOne(
          {
            _id: id,
          },
          {
            itinerary: ItineraryArray,
          }
        );
      } else if (typeof cover_itinerary === "string") {
        // console.log("22222");
        // let OldItinerary = ExistPackage.itinerary;
        // console.log("OldItinerary Start = ", OldItinerary);
        // console.log({ OldItinerary });
        // console.log({ cover_itinerary_index });
        // if (Array.isArray(title_itinerary)) {
        // console.log("33333");
        // for (let index = 0; index < title_itinerary?.length; index++) {
        //   if (OldItinerary[index]) {
        //     OldItinerary[index].title_itinerary = title_itinerary[index];
        //     OldItinerary[index].content_itinerary = content_itinerary[index];
        //   }
        // }
        // for (let index = 0; index < files2?.length; index++) {
        //   if (OldItinerary[parseInt(cover_itinerary_index[index])]) {
        //     OldItinerary[
        //       parseInt(cover_itinerary_index[index])
        //     ].cover_itinerary = files2[index]?.filename;
        //   }
        // }
        // await Package.updateOne(
        //   {
        //     _id: id,
        //   },
        //   {
        //     itinerary: OldItinerary,
        //   }
        // );
        // console.log("OldItinerary End = ", OldItinerary);
        // } else {
        //   console.log("44444");
        //   let ItineraryItem = {
        //     title_itinerary,
        //     cover_itinerary,
        //     content_itinerary,
        //   };
        //   await Package.updateOne(
        //     {
        //       _id: id,
        //     },
        //     {
        //       itinerary: ItineraryItem,
        //     }
        //   );
        // }
      } else if (!cover_itinerary) {
        console.log("5555");
        let ItineraryArray = [];
        for (let index = 0; index < title_itinerary.length; index++) {
          ItineraryArray.push({
            title_itinerary: title_itinerary[index],
            cover_itinerary: files2[index]?.filename,
            content_itinerary: content_itinerary[index],
          });
        }

        await Package.updateOne(
          {
            _id: id,
          },
          {
            itinerary: ItineraryArray,
          }
        );
      }
    } else if (!files2) {
      console.log("66666");
      if (Array.isArray(title_itinerary)) {
        let ItineraryArray = [];
        for (let index = 0; index < title_itinerary.length; index++) {
          ItineraryArray.push({
            title_itinerary: title_itinerary[index],
            cover_itinerary: cover_itinerary[index],
            content_itinerary: content_itinerary[index],
          });
        }

        await Package.updateOne(
          {
            _id: id,
          },
          {
            itinerary: ItineraryArray,
          }
        );
      } else {
        console.log("77777");
        let ItineraryItem = {
          title_itinerary,
          cover_itinerary,
          content_itinerary,
        };
        await Package.updateOne(
          {
            _id: id,
          },
          {
            itinerary: ItineraryItem,
          }
        );
      }
    }

    // Pocket
    let PocketArray = [];
    for (let index = 0; index < title_pocket.length; index++) {
      PocketArray.push({
        title_pocket: title_pocket[index],
        activities_pocket: activities_pocket[index],
        where_to_stay_pocket: where_to_stay_pocket[index],
        meals_pocket: meals_pocket[index],
      });
    }

    if (Array.isArray(title_pocket)) {
      for (let index = 0; index < title_pocket.length; index++) {
        await Package.updateOne(
          {
            _id: id,
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
          _id: id,
        },
        {
          pocket_summary: PocketItem,
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
