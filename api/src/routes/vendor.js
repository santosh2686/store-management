const express = require("express");
const mongoose = require("mongoose");
const update = require("immutability-helper");
const router = express.Router();

const Vendor = require("../models/vendor");
const Product = require("../models/product");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const data = await Vendor.find(query).select("-__v").lean();
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
    const data = await Vendor.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const { products } = requestBody;
  const objectId = new mongoose.Types.ObjectId();
  const payload = update(requestBody, {
    $merge: {
      _id: objectId,
    },
    $unset: ["products"],
  });
  const vendor = new Vendor(payload);
  const productPayload = products.map((product) => {
    product.vendor = objectId;
    return product;
  });

  try {
    const data = await vendor.save();
    const productsData = await Product.insertMany(productPayload);
    res.status(201).json({
      message: `Vendor added successfully with ${productPayload.length} product(s).`,
      data,
      productsData,
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
    const data = await Vendor.updateOne(
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
    await Vendor.deleteOne({ _id: id });
    res.status(200).json({
      message: "Vendor deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
