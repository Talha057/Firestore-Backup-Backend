const login = require("../../controller/loginCon/index");
const express = require("express");
const router = express.Router();
router.post("/login", login);
module.exports = router;
