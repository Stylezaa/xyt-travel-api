// Library
const express = require("express");
const router = express.Router();
// Controllers
const {
  GetsCategories,
  GetCategory,
  InsertCategory,
  UpdateCategory,
  DeleteCategoryByID,
} = require("../controllers/category");

//Middleware
const { auth, AdminCheck } = require("../middleware/AuthCheck"); // Must has token for access

//@Endpoint https://localhost:4000/api/category/gets
//@Method   GET
//@Access   Private
router.get("/category/gets", auth, GetsCategories);

//@Endpoint https://localhost:4000/api/category/get/:id
//@Method   GET
//@Access   Private
router.get("/category/get/:id", auth, GetCategory);

//@Endpoint https://localhost:4000/api/category/insert
//@Method   POST
//@Access   Private
router.post("/category/insert", auth, AdminCheck, InsertCategory);

//@Endpoint https://localhost:4000/api/category/update/:id
//@Method   PATCH
//@Access   Private
router.patch("/category/update/:id", auth, AdminCheck, UpdateCategory);

//@Endpoint https://localhost:4000/api/category/delete/:id
//@Method   DELETE
//@Access   Private
router.delete("/category/delete/:id", auth, AdminCheck, DeleteCategoryByID);

module.exports = router;
