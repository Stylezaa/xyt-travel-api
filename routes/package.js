const express = require("express");
const router = express.Router();

// Functions
const upload = require("../functions/PackageUploadConfig");

//Controllers
const {
  GetPackageAll,
  GetPackageByID,
  Insert,
} = require("../controllers/package");

//Middleware
const { auth, AdminCheck } = require("../middleware/AuthCheck"); // Must has token for access

// ====================================
// ====== Package Services ========
// ====================================

//@Endpoint https://localhost:8000/api/package/getall
//@Method   GET
//@Access   Publish
router.get("/package/getall", GetPackageAll);

//@Endpoint https://localhost:8000/api/package/get/:id
//@Method   POST
//@Access   Publish
router.post("/package/get/:id", GetPackageByID);

//@Endpoint https://localhost:8000/api/package/insert
//@Method   POST
//@Access   Publish
router.post(
  "/package/insert",
  upload.fields([
    { name: "cover_package", maxCount: 1 },
    { name: "cover_itinerary", maxCount: 1 },
  ]),
  Insert
);

module.exports = router;
