const express = require("express");
const mongoose = require("mongoose");
const update = require("immutability-helper");
const router = express.Router();

const Customer = require("../models/customer");
const DefaultProduct = require("../models/defaultProduct");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const data = await Customer.find(query).select("-__v").lean();
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
    const data = await Customer.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const { defaultProducts } = requestBody;
  const objectId = new mongoose.Types.ObjectId();
  const payload = update(requestBody, {
    $merge: {
      _id: objectId,
    },
    $unset: ["defaultProducts"],
  });
  const customer = new Customer(payload);

  const defaultProductPayload = defaultProducts.map((product) => {
    product.customer = objectId;
    return product;
  });

  try {
    const data = await customer.save();
    const defaultProductsData = await DefaultProduct.insertMany(
      defaultProductPayload
    );
    res.status(201).json({
      message: `Customer added successfully with ${defaultProductPayload.length} default product(s).`,
      data,
      defaultProductsData,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await Customer.updateOne(
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
    await Customer.deleteOne({ _id: id });
    res.status(200).json({
      message: "Customer deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
