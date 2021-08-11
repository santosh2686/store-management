const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const StaffAttendance = require("../models/staffAttendance");

router.get("/", async (req, res, next) => {
  const { query } = req;
  try {
    const data = await StaffAttendance.find(query).select("-__v").lean();
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await StaffAttendance.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const staffAttendance = new StaffAttendance({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await staffAttendance.save();
    res.status(201).json({
      message: "Staff attendance updated successfully",
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
    const data = await StaffAttendance.updateOne(
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
    await StaffAttendance.deleteOne({ _id: id });
    res.status(200).json({
      message: "Staff attendance deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
