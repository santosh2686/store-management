const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const CustomerOrder = require("../models/customerOrder");
const Product = require("../models/product");
const Customer = require("../models/customer");
const Report = require("../models/report");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const { type, startDate, endDate } = query;

 const findQuery = {
   type,
 }

 if(startDate && endDate) {
  findQuery.createdAt = {
    $gt: `${startDate}T00:00:00.000Z`,
    $lt: `${endDate}T23:59:59.000Z`,
  }
 }

  const data = await CustomerOrder.find(findQuery)
    .populate("customer products.product")
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
  const id = req.params.id;
  try {
    const data = await CustomerOrder.findById(id)
      .populate("products")
      .select("-__v")
      .lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const requestBody = req.body;
  const {
    products,
    isAddedToAccount,
    customer: customerId,
    orderTotal,
    year,
    month,
  } = requestBody;
  const customerOrder = new CustomerOrder({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });
  let profit = 0;
  try {
    const data = await customerOrder.save();
    if (isAddedToAccount) {
      await Customer.updateOne(
        { _id: customerId },
        {
          $inc: {
            balance: orderTotal,
          },
        }
      );
    }

    for (let index = 0; index < products.length; index++) {
      const { product: productId, quantity } = products[index];
      const product = await Product.findById(productId);
      const { buyPrice, sellPrice } = product;
      const productProfit = quantity * (sellPrice - buyPrice);
      profit = profit + productProfit;
      await Product.updateOne(
        { _id: productId },
        {
          $inc: {
            quantity: -quantity,
          },
        }
      );
    }
    const filter = {
      year,
      month,
    };

    const requestData = {
      $inc: {
        profit: profit,
        sale: orderTotal,
      },
    };

    await Report.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    res.status(201).json({
      message: "Customer Order added successfully",
      data,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await CustomerOrder.updateOne(
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
    await CustomerOrder.deleteOne({ _id: id });
    res.status(200).json({
      message: "Customer Order deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
