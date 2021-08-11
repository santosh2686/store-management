const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Expense = require("../models/expense");
const Report = require("../models/report");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const data = await Expense.find(query).select("-__v").lean();
  try {
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
    const data = await Expense.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const { amount, year, month } = requestBody;
  const expense = new Expense({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await expense.save();

    const filter = {
      year,
      month,
    };

    const requestData = {
      $inc: {
        expense: amount,
      },
    };

    await Report.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });
    res.status(201).json({
      message: "Expense added successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await Expense.updateOne(
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
    await Expense.deleteOne({ _id: id });
    res.status(200).json({
      message: "Expense deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
