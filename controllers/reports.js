const Package = require("../models/package");
const Booking = require("../models/booking");
const Activity = require("../models/activity");
// Library
const moment = require("moment");
// Variable
const status = require("../data/status");

const startOfToday = moment().startOf("day");
const fiveDaysAgo = startOfToday.clone().subtract(5, "days");

exports.GetReportAdmin = async (req, res) => {
  try {
    let TotalPackages = await Package.find();
    let TotalBooking = await Booking.find();
    let TotalIncome = await Booking.find({ status: status.Paymented })
      .then((result) => {
        let price = 0;
        for (let index = 0; index < result.length; index++) {
          if (result[index]?.totalPrice > 0) {
            price = price + result[index]?.totalPrice;
          }
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

exports.GetAllBookingByCreatedAt = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $match: {
          status: "ຈອງສໍາເລັດ",
          // createdAt: { $gte: fiveDaysAgo.toDate(), $lt: startOfToday.toDate() },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
      {
        $addFields: {
          timestamp: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ]);

    res.status(200).send({
      message: result,
      status: 200,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
      status: 500,
    });
  }
};
