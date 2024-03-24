const express = require('express')
const router = express.Router()

// Functions
const upload = require('../functions/PackageUploadConfig')

//Controllers
const {
  GetPackageAll,
  GetPackageByCate,
  GetPackageByID,
  Insert,
  UpdatePackage,
  DeletePackageById,
} = require('../controllers/package')

//Middleware
const { auth, AdminCheck } = require('../middleware/AuthCheck') // Must has token for access

// ====================================
// ====== Package Services ========
// ====================================

//@Endpoint https://localhost:8000/api/package/getall
//@Method   GET
//@Access   Publish
router.get('/package/getall', GetPackageAll)

//@Endpoint https://localhost:8000/api/package/getall
//@Method   GET
//@Access   Publish
router.get('/package/getall/category', GetPackageByCate)

//@Endpoint https://localhost:8000/api/package/get/:id
//@Method   GET
//@Access   Publish
router.get('/package/get/:id', GetPackageByID)

//@Endpoint https://localhost:8000/api/package/insert
//@Method   POST
//@Access   Private
router.post(
  '/package/insert',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'cover_itinerary', maxCount: 20 },
  ]),
  auth,
  Insert
)

//@Endpoint https://localhost:8000/api/package/update/:id
//@Method   Patch
//@Access   Private
router.patch(
  '/package/update/:id',
  auth,
  AdminCheck,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'cover_itinerary', maxCount: 20 },
  ]),
  UpdatePackage
)

//@Endpoint https://localhost:8000/api/package/delete/:id
//@Method   Delete
//@Access   Private
router.delete('/package/delete/:id', auth, AdminCheck, DeletePackageById)

module.exports = router
