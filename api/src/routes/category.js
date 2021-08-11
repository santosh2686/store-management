const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Category = require("../models/category");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const data = await Category.find(query).select("-__v").lean();
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
  const { id } = req.params;
  try {
    const data = await Category.findById(id)
      .populate("products", "_id productName soldAs")
      .select("-__v")
      .lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await category.save();
    res.status(201).json({
      message: "Product category added successfully",
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
    const data = await Category.updateOne(
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
    await Category.deleteOne({ _id: id });
    res.status(200).json({
      message: "deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
