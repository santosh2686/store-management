const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const DailyProductUpdate = require("../models/dailyProductUpdate");

router.get("/", async (req, res, next) => {
  const { query } = req;
  try {
    const data = await DailyProductUpdate.find(query).select("-__v").lean();
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await DailyProductUpdate.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const { dailyProducts } = requestBody;
  const dailyProduct = new DailyProductUpdate({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await dailyProduct.save();
    res.status(201).json({
      message: "Daily product(s) updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await DailyProductUpdate.updateOne(
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
    await DailyProductUpdate.deleteOne({ _id: id });
    res.status(200).json({
      message: "Daily product deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
