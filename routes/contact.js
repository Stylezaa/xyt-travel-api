// Library
const express = require("express");
const router = express.Router();
// Controllers
const { ContactUs } = require("../controllers/contact");

//@Endpoint https://localhost:4000/api/contact/insert
//@Method   POST
//@Access   Publish
router.post("/contact/insert", ContactUs);

module.exports = router;
