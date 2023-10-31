const express = require('express');
const router = express.Router();

//Controllers
const {
  CheckHealth,
  GetAllUsers,
  Register,
  Login,
  GetProfile,
} = require('../controllers/auth');

//Middleware
const { auth, AdminCheck } = require('../middleware/AuthCheck'); // Must has token for access

// ====================================
// ====== Check Authentication ========
// ====================================

//@Endpoint https://localhost:8000/api/auth/checkhealth
//@Method   GET
//@Access   Publish
router.get('/auth/checkhealth', CheckHealth);

//@Endpoint https://localhost:8000/api/auth/users
//@Method   GET
//@Access   Publish
router.get('/auth/users', GetAllUsers);

//@Endpoint https://localhost:8000/api/auth/register
//@Method   POST
//@Access   Publish
router.post('/auth/register', Register);

//@Endpoint https://localhost:8000/api/auth/login
//@Method   POST
//@Access   Publish
router.post('/auth/login', Login);

//@Endpoint https://localhost:8000/api/auth/get-profile
//@Method   GET
//@Access   Private
router.get('/auth/get-profile', auth, GetProfile);

// ====================================
// =========== Check Role =============
// ====================================
//@Endpoint https://localhost:4000/api/auth/current-user
//@Method   POST
//@Access   Private
router.post('/auth/current-user', auth, GetProfile);

//@Endpoint https://localhost:4000/api/auth/current-admin
//@Method   POST
//@Access   Private
router.post('/auth/current-admin', auth, AdminCheck, GetProfile);

module.exports = router;
