const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      return res
        .status(400)
        .json({ status: "fail", message: "Token is missing." });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ status: "fail", message: error.message });
  }
};

module.exports = fetchuser;
