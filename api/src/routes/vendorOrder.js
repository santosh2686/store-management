const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { parsePatchRequestBody } = require("../utils");

const VendorOrder = require("../models/vendorOrder");
const Product = require("../models/product");
const Vendor = require("../models/vendor");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const data = await VendorOrder.find(query)
    .populate("vendor")
    .select("-__v")
    .lean();
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
  const { params, query } = req;
  const { id } = params;
  const { include_vendor } = query;
  try {
    const data = await VendorOrder.findById(id)
      .select("-__v")
      .populate(include_vendor ? "vendor" : "")
      .lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const vendorOrder = new VendorOrder({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await vendorOrder.save();
    res.status(201).json({
      message: "Vendor order added successfully",
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
        "name": "pulses" // path of the field and value
    }
*/
router.patch("/:id", async (req, res, next) => {
  const {
    params: { id },
    body,
  } = req;
  try {
    const data = await VendorOrder.updateOne(
      { _id: id },
      {
        $set: parsePatchRequestBody(body),
      }
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const {
    params: { id },
    body,
  } = req;
  const {
    products,
    isPaymentAddedToAccount,
    orderTotal,
    payment,
    vendor: vendorId,
  } = body;
  const productIds = Object.keys(products);
  let balanceAmount = orderTotal;
  if (!isPaymentAddedToAccount) {
    const { amount = 0 } = payment;
    balanceAmount = orderTotal - amount;
  }
  try {
    const data = await VendorOrder.updateOne({ _id: id }, body);
    await Vendor.updateOne(
      { _id: vendorId },
      {
        $inc: {
          balance: balanceAmount,
        },
      }
    );
    for (let index = 0; index < productIds.length; index++) {
      const productId = productIds[index];
      const { quantityReceived, buyPrice, sellPrice } = products[productId];
      await Product.updateOne(
        { _id: productId },
        {
          $set: {
            buyPrice,
            sellPrice,
          },
          $inc: {
            quantity: quantityReceived,
          },
        }
      );
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    await VendorOrder.deleteOne({ _id: id });
    res.status(200).json({
      message: "Vendor order deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
