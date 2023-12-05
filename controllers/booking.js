// Model
const Booking = require("../models/booking");
const Package = require("../models/package");
// Function Random Name Order
function RandomID(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

exports.GetBookingAll = async (req, res) => {
  try {
    let data = await Booking.find()
      .populate({ path: "package_id" })
      .sort({ createdAt: -1 });

    if (data.length === 0) {
      return res.status(404).send({
        message: "Not Found Any Booking",
        status: 404,
      });
    }

    res.status(200).send({
      message: data,
      status: 200,
    });
  } catch (error) {
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};

exports.GetBookingByID = async (req, res) => {
  try {
    const { id } = req.params;
    let bookingOne = await Booking.findOne({ _id: id })
      .populate("package_id")
      .exec();
    if (!bookingOne) {
      return res.status(404).send({
        message: "Not Found This Booking",
        status: 404,
      });
    }
    res.status(200).send({
      message: bookingOne,
      status: 200,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
      status: 500,
    });
  }
};

exports.InsertBooking = async (req, res) => {
  try {
    const {
      package_id,
      adults,
      children,
      infants,
      date_of_arrival,
      arrival_airport,
      tour_type,
      special_requirement,
      gender,
      //Passport
      name_passport,
      date_of_birth_passport,
      email,
      phone_number,
      country,
      city,
      whatsapp,
      facebook,
    } = req.body;

    let booking = new Booking({
      booking_number: RandomID(12),
      package_id,
      adults,
      children,
      infants,
      date_of_arrival,
      arrival_airport,
      tour_type,
      special_requirement,
      gender,
      name_passport,
      date_of_birth_passport,
      email,
      phone_number,
      country,
      city,
      whatsapp,
      facebook,
    });

    await booking.save(); // Save to database

    if (booking) {
      await Package.updateOne(
        {
          _id: package_id,
        },
        {
          $push: {
            users_booking: booking._id,
          },
        }
      );
    }

    res.status(201).send({
      message: "Create Booking Successfully",
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

exports.DeleteBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { package_id } = req.body;

    const dataOne = await Booking.deleteOne({ _id: id });

    if (!dataOne) {
      return res.status(404).send({
        message: "Not Found This Booking Item",
        status: 404,
      });
    }

    await Package.updateOne(
      {
        _id: package_id,
      },
      {
        $pull: {
          users_booking: id,
        },
      }
    );

    res.status(200).send({
      message: "Delete This Booking Successfully",
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

// Change Status Booking
exports.ChangeStatusBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    // Check ID has found ?
    const ExistBooking = await Booking.findById(id);
    if (!ExistBooking) {
      return res.status(404).send({
        message: "ບໍ່ພົບລາຍການນີ້",
        status: 404,
      });
    }

    await Booking.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );

    res.status(200).json({
      message: "ບັນທຶກສະຖານະສໍາເລັດ",
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
