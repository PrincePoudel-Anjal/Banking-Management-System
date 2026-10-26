const express = require("express");
const authcontroller = require('../controllers/auth.controller')
const router = express.Router()
// const jwt = require('jsonwebtoken');

router.post("/register",authcontroller.userRegisterController);
router.post("/login",authcontroller.userLogin);

module.exports = router;





