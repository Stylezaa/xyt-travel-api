// Library
const express = require("express");
const router = express.Router();
// Controllers
const {
  GetsActivities,
  GetsActivitiesPublish,
  GetActivityByID,
  InsertActivity,
  UpdateActivity,
  DeleteActivityByID,
} = require("../controllers/activity");
// Middleware
const { auth, AdminCheck } = require("../middleware/AuthCheck"); // Must has token for access
// Functions
const upload = require("../functions/ActivityUploadConfig");

//@Endpoint https://localhost:4000/api/activity/gets
//@Method   GET
//@Access   Private
router.get("/activity/gets", auth, GetsActivities);

//@Endpoint https://localhost:4000/api/activity/gets
//@Method   GET
//@Access   Publish
router.get("/activity/gets/publish", GetsActivitiesPublish);

//@Endpoint https://localhost:4000/api/activity/get/:id
//@Method   GET
//@Access   Private
router.get("/activity/get/:id", auth, GetActivityByID);

//@Endpoint https://localhost:4000/api/activity/insert
//@Method   POST
//@Access   Private
router.post(
  "/activity/insert",
  auth,
  AdminCheck,
  upload.single("cover"),
  InsertActivity
);

//@Endpoint https://localhost:4000/api/activity/update/:id
//@Method   PATCH
//@Access   Private
router.patch(
  "/activity/update/:id",
  auth,
  AdminCheck,
  upload.single("cover"),
  UpdateActivity
);

//@Endpoint https://localhost:4000/api/activity/delete/:id
//@Method   DELETE
//@Access   Private
router.delete("/activity/delete/:id", auth, AdminCheck, DeleteActivityByID);

module.exports = router;
