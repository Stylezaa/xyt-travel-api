const express = require("express");
const router = express.Router();

//Controllers
const {
  GetBookingAll,
  GetBookingByID,
  InsertBooking,
  DeleteBookingById,
  ChangeStatusBooking,
} = require("../controllers/booking");

//Middleware
const { auth, AdminCheck } = require("../middleware/AuthCheck"); // Must has token for access

// ====================================
// ====== Booking Services ========
// ====================================

//@Endpoint https://localhost:8000/api/booking/getall
//@Method   GET
//@Access   Private
router.get("/booking/getall", auth, GetBookingAll);

//@Endpoint https://localhost:8000/api/booking/get/:id
//@Method   POST
//@Access   Private
router.post("/booking/get/:id", auth, GetBookingByID);

//@Endpoint https://localhost:8000/api/booking/insert
//@Method   POST
//@Access   Private
router.post("/booking/insert", InsertBooking);

//@Endpoint https://localhost:8000/api/booking/delete/:id
//@Method   Delete
//@Access   Private
router.delete("/booking/delete/:id", auth, DeleteBookingById);

//@Endpoint https://localhost:8000/api/booking/change-status/:id
//@Method   POST
//@Access   Private
router.post(
  "/booking/change-status/:id",
  auth,
  AdminCheck,
  ChangeStatusBooking
);

module.exports = router;
