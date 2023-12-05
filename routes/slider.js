const express = require("express");
const router = express.Router();

//Controllers
const {
  GetAllSlider,
  GetSliderByID,
  Insert,
  Update,
} = require("../controllers/slider");
// Functions
const upload = require("../functions/SliderUploadConfig");

//Middleware
const { auth, adminCheck } = require("../middleware/AuthCheck"); // Must has token for access

//@Endpoint https://localhost:8000/api/slider/getall
//@Method   GET
//@Access   Publish
router.get("/slider/getall", GetAllSlider);

//@Endpoint https://localhost:8000/api/slider/get/:id
//@Method   GET
//@Access   Publish
router.get("/slider/get/:id", GetSliderByID);

//@Endpoint https://localhost:8000/api/slider/insert
//@Method   POST
//@Access   Private
router.post(
  "/slider/insert",
  auth,
  upload.fields([{ name: "images", maxCount: 9 }]),
  Insert
);

//@Endpoint https://localhost:8000/api/slider/update/:id
//@Method   PATCH
//@Access   Private
router.patch(
  "/slider/update/:id",
  auth,
  upload.fields([{ name: "images", maxCount: 9 }]),
  Update
);

module.exports = router;
