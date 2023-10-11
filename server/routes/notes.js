const fetchuser = require("../middlewares/fetchuser");
const Note = require("../models/Note");
const router = require("express").Router();

router.post("/create", fetchuser, async (req, res) => {
  try {
    await Note.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(404).json({ status: "success", message: error.message });
  }
});

router.get("/all", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });

    res.status(200).json({ status: "success", data: notes });
  } catch (error) {
    res.status(404).json({ status: "success", message: error.message });
  }
});

router.get("/:id", fetchuser, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    res.status(200).json({ status: "success", data: note });
  } catch (error) {
    res.status(404).json({ status: "success", message: error.message });
  }
});

router.patch("/:id", fetchuser, async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(404).json({ status: "success", message: error.message });
  }
});

router.delete("/:id", fetchuser, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: "success" });
  } catch (error) {
    res.status(404).json({ status: "success", message: error.message });
  }
});

module.exports = router;
