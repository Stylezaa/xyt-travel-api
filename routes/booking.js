const express = require("express");
const router = express.Router();

//Controllers
const {
  GetBookingAll,
  GetBookingByID,
  InsertBooking,
  DeleteBookingById,
} = require("../controllers/booking");

//Middleware
const { auth, AdminCheck } = require("../middleware/AuthCheck"); // Must has token for access

// ====================================
// ====== Booking Services ========
// ====================================

//@Endpoint https://localhost:8000/api/booking/getall
//@Method   GET
//@Access   Publish
router.get("/booking/getall", GetBookingAll);

//@Endpoint https://localhost:8000/api/booking/get/:id
//@Method   POST
//@Access   Publish
router.post("/booking/get/:id", GetBookingByID);

//@Endpoint https://localhost:8000/api/booking/insert
//@Method   POST
//@Access   Private
router.post("/booking/insert", InsertBooking);

//@Endpoint https://localhost:8000/api/booking/delete/:id
//@Method   Delete
//@Access   Private
router.delete("/booking/delete/:id", DeleteBookingById);

module.exports = router;
