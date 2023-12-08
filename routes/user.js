const express = require("express");

// Middleware
const { AuthAdmin, AuthToken } = require('../middlewares/AuthLogin');
const { AuthReg, AuthLog } = require('../middlewares/AuthBody/UserBody');
const { VerifToken } = require('../controllers/VerifyEmail');

const { Register, Login, getUsers } = require('../controllers/Users');


const router = express.Router();
//Routes

// User
router.post('/register', AuthReg, Register);
router.post('/login', AuthLog, Login);
router.get('/users', AuthAdmin, getUsers);
router.post('/verif', VerifToken);

module.exports = router;