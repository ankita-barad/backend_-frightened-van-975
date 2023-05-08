const express = require("express");
const { ProductModel } = require("../models/product.model");
const productRoute = express.Router();

productRoute.post("/create", async (req, res) => {
  try {
    let products = await ProductModel.insertMany(req.body);
    res.send(products);
  } catch (error) {
    console.log(error);
  }
});

productRoute.get("/", async (req, res) => {
  try {
    const { Materials, Metals, Sizes } = req.query;

    const dbQuery = {
      ...(Materials
        ? {
            material: {
              $in: Materials?.split(","),
            },
          }
        : {}),
      ...(Metals
        ? {
            metal: {
              $in: Metals?.split(","),
            },
          }
        : {}),
      ...(Sizes
        ? {
            size: {
              $in: Sizes.split(","),
            },
          }
        : {}),
    };

    console.log(dbQuery);

    let products = await ProductModel.find(dbQuery, null, {
      sort: "price",
    });

    res
      .status(200)
      .send(JSON.stringify({ products, filters: {}, total: products.length }));
  } catch (error) {
    console.log(error);
  }
});

productRoute.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let product = await ProductModel.findById({ _id: id });
    res.status(200).send(JSON.stringify(product));
  } catch (err) {
    console.log(err);
  }
});

module.exports = { productRoute };
