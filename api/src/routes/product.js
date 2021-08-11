const express = require("express");
const update = require("immutability-helper");
const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res, next) => {
  const { query } = req;
  const { include_category } = query;
  const queryParams = update(query, {
    $unset: ["include_category"],
  });
  const data = await Product.find(queryParams)
    .populate(
      include_category ? "category" : "",
      include_category ? "name -_id" : ""
    )
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
    const data = await Product.findById(id).select("-__v").lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { vendor, products } = req.body;

  const productPayload = products.map((product) => {
    product.vendor = vendor;
    return product;
  });

  try {
    const data = await Product.insertMany(productPayload);
    res.status(201).json({
      message: `${products.length} product(s) added successfully`,
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
  const { id } = req.params;
  try {
    const data = await Product.updateOne(
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

router.post("/update-multiple", async (req, res, next) => {
  const { products } = req.body;
  const productIds = Object.keys(products);
  try {
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
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await Product.deleteOne({ _id: id });
    res.status(200).json({
      message: "Product deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
