const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../models/user");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const data = await User.find(query).select("-__v").lean();
  try {
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await User.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;

  if (requestBody.password !== requestBody.confirmPassword) {
    var err = new Error("Passwords do not match.");
    err.status = 400;
    return next(err);
  }

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await user.save();
    res.status(201).json({
      message: "User added successfully",
      data,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});
/*
  Path Format
  {
      "name":"pulses" // path of the field and value
  }
*/
router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await User.updateOne(
      { _id: id },
      {
        $set: req.body,
      }
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await User.deleteOne({ _id: id });
    res.status(200).json({
      message: "User deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
