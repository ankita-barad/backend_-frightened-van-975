const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("TOKEN: ", token);
  if (token) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], "masai");
      if (decoded) {
        req.userId = decoded.userId;
        next();
      } else {
        res.send({ msg: "please login" });
      }
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  } else {
    res.send({ msg: "please login" });
  }
};

module.exports = { auth };
