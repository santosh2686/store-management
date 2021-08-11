const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Staff = require("../models/staff");

router.get("/", async (req, res, next) => {
  const { query } = req;
  try {
    const data = await Staff.find(query).select("-__v").lean();
    const response = {
      count: data.length,
      list: data,
    };
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await Staff.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const staff = new Staff({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await staff.save();
    res.status(201).json({
      message: "Staff added successfully",
      data,
    });
  } catch (error) {
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
    const data = await Staff.updateOne(
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
    await Staff.deleteOne({ _id: id });
    res.status(200).json({
      message: "Staff deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
