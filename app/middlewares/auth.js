require("dotenv").config();
const secret = process.env.JWT_TOKEN;
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const withAuth = (req, res, nex) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided!" });
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token!");
      } else {
        req.email = decoded.email;
        User.findOne({
          email: decoded.email
        })
          .then(user => {
            req.user = user;
            nex();
          })
          .catch(err => {
            res.status(401).json({ error: err });
          });
      }
    });
  }
};

module.exports = withAuth;
