// Library
const express = require("express");
const router = express.Router();
// Controllers
const { UploadBilling } = require("../controllers/bill");
// Middleware
const { auth, AdminCheck } = require("../middleware/AuthCheck");
// Functions
const upload = require("../functions/BillingUploadConfig");

//@Endpoint https://localhost:4000/api/user/insert
//@Method   POST
//@Access   Private
router.post("/billing/create", upload.single("billing_file"), UploadBilling);

module.exports = router;
