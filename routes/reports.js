// Library
const express = require("express");
const router = express.Router();
// Controllers
const {
  GetReportAdmin,
  GetAllBookingByCreatedAt,
} = require("../controllers/reports");
// Middleware
const { auth } = require("../middleware/AuthCheck");

//@Endpoint https://localhost:4000/api/activity/gets
//@Method   GET
//@Access   Private
router.get("/report/gets/admin", auth, GetReportAdmin);

//@Endpoint https://localhost:8000/api/report/daybycreated
//@Method   GET
//@Access   Private
router.get("/report/daybycreated", auth, GetAllBookingByCreatedAt);

module.exports = router;
