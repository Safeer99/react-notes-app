const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fetchuser = require("../middlewares/fetchuser");

router.post("/register", async (req, res) => {
  try {
    const salt = process.env.SECRET_KEY;
    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      salt
    ).toString();

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: encryptedPassword,
    });

    const data = {
      user: {
        id: user._id,
      },
    };

    const authToken = jwt.sign(data, process.env.JWT_SECRET);

    res.status(201).json({ status: "success", token: authToken });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Internal Error " + error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const salt = process.env.SECRET_KEY;
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    var bytes = CryptoJS.AES.decrypt(user.password, salt);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password)
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid email or password" });

    const data = {
      user: {
        id: user._id,
      },
    };

    const authToken = jwt.sign(data, process.env.JWT_SECRET);

    res.status(200).json({ status: "success", token: authToken });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Internal Error " + error.message });
  }
});

router.post("/getUser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -_id");

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Internal Error " + error.message });
  }
});

module.exports = router;
