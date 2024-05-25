const backupCon = require("../../controller/backupCon/backupGenerator");
const restore = require("../../controller/backupCon/restore");
const express = require("express");
const verifyToken = require("../../controller/verifyToken");
const router = express.Router();
router.post("/backup", verifyToken, backupCon.backupdb);
router.get("/files", verifyToken, backupCon.getFiles);
router.post("/restore", verifyToken, restore);
module.exports = router;
