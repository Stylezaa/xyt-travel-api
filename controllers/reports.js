const Package = require("../models/package");
const Booking = require("../models/booking");
const Activity = require("../models/activity");

exports.GetReportAdmin = async (req, res) => {
  try {
    let TotalPackages = await Package.find();
    let TotalBooking = await Booking.find();
    let TotalIncome = await Booking.find().populate("package_id");
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
