const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const VendorAccount = require("../models/vendorAccount");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const data = await VendorAccount.find(query).select("-__v").lean();
  try {
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await VendorAccount.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const vendorAccount = new VendorAccount({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await vendorAccount.save();
    res.status(201).json({
      message: "Vendor account added successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await VendorAccount.updateOne(
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
    await VendorAccount.deleteOne({ _id: id });
    res.status(200).json({
      message: "Vendor account deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
