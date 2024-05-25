const userData = require("../../config/userData.json");
const jwt = require("jsonwebtoken");
const login = (req, res) => {
  const { name, password } = req.body;
  const user = {
    name,
    password,
  };
  if (
    !userData.some(
      (elem) => elem.username === name && elem.password === password
    )
  ) {
    res.status(404).send({
      message: "Incorrect username and password",
    });
  } else {
    jwt.sign({ user }, "loginn", (err, token) => {
      res.status(200).send({
        token,
      });
    });
  }
};

module.exports = login;
