const express = require("express");
const { authGoogle, callbackGoogle } = require("../controllers/Users");

const router = express.Router();

router.get("/auth/google", authGoogle);

router.get("/auth/google/callback", callbackGoogle);

module.exports = router;
