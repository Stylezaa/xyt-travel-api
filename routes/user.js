// Library
const express = require("express");
const router = express.Router();
// Controllers
const {
  GetsUserForAdmin,
  GetByID,
  InsertUser,
  UpdateUser,
  DeleteUser,
} = require("../controllers/user");
// Middleware
const { auth, AdminCheck } = require("../middleware/AuthCheck");
// Functions
const upload = require("../functions/ProfileUploadConfig");

//@Endpoint https://localhost:4000/api/user/gets
//@Method   GET
//@Access   Private
router.get("/user/gets/admin", auth, AdminCheck, GetsUserForAdmin);

//@Endpoint https://localhost:4000/api/user/get/:id
//@Method   GET
//@Access   Private
router.get("/user/get/:id", auth, GetByID);

//@Endpoint https://localhost:4000/api/user/insert
//@Method   POST
//@Access   Private
router.post(
  "/user/insert",
  auth,
  AdminCheck,
  upload.single("profile_img"),
  InsertUser
);

//@Endpoint https://localhost:4000/api/user/update/:id
//@Method   POST
//@Access   Private
router.patch(
  "/user/update/:id",
  auth,
  upload.single("profile_img"),
  UpdateUser
);

//@Endpoint https://localhost:4000/api/user/delete/:id
//@Method   POST
//@Access   Private
router.delete("/user/delete/:id", auth, AdminCheck, DeleteUser);

module.exports = router;
