const express = require("express");
const router = express.Router();
const loginRouter = require("./router/loginRouter/index");
const backupRouter = require("./router/backupRouter/index");

router.use(loginRouter);
router.use(backupRouter);
module.exports = router;
 