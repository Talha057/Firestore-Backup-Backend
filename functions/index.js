require("dotenv").config();
const express = require("express");
const app = express();
const cron = require("node-cron");
const backupCon = require("./controller/backupCon/backupGenerator");

const mainRouter = require("./mainRouter");
//Middleware
const bodyParser = express.json();
var cors = require("cors");
app.use(cors());
app.use(bodyParser);
app.use(express.static("public"));
app.use(mainRouter);
// cron.schedule("55 23 * * *", () => {
//   console.log("Cron Job running at 11:55 PM Daily");
//   backupCon.exportBackup()
// });
app.listen("8010", () => {
  console.log("Server is running");
});
