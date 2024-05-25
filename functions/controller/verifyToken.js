function verifyToken(req, res, next) {
  if (req?.query?.token) {
    var token = req.query.token;
  } else {
    token = req.body.token;
  }
  //   console.log(token);
  if (token) {
    req.token = token;
    next();
  } else {
    res.status(402).send({
      result: "Token is not valid",
    });
  }
}
module.exports = verifyToken;
