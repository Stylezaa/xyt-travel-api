// Library
const express = require("express");
const router = express.Router();
// Controllers
const { GetReportAdmin } = require("../controllers/reports");
// Middleware
const { auth } = require("../middleware/AuthCheck");

//@Endpoint https://localhost:4000/api/activity/gets
//@Method   GET
//@Access   Private
router.get("/report/gets/admin", auth, GetReportAdmin);

module.exports = router;
