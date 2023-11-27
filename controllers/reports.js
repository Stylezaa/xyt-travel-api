const Package = require("../models/package");
const Booking = require("../models/booking");
const Activity = require("../models/activity");
// Variable
const status = require("../data/status");

exports.GetReportAdmin = async (req, res) => {
  try {
    let TotalPackages = await Package.find();
    let TotalBooking = await Booking.find();
    // let TotalIncome = await Booking.find().populate("package_id");
    let TotalIncome = await Booking.find({ status: status.Paymented })
      .populate({ path: "package_id" })
      .then((result) => {
        let price = 0;
        for (let index = 0; index < result.length; index++) {
          price = price + result[index].package_id.price;
        }
        return price;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    let TotalActivity = await Activity.find();

    res.status(200).send({
      message: {
        TotalPackages: TotalPackages,
        TotalBooking: TotalBooking,
        TotalIncome: TotalIncome,
        TotalActivity: TotalActivity,
      },
      status: 200,
    });
  } catch (error) {
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};
