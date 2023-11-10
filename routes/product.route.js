const express = require("express");
const { ProductModel } = require("../models/product.model");
const productRoute = express.Router();
const { auth } = require("../middlewares/auth");

productRoute.post("/create", auth, async (req, res) => {
  try {
    let products = await ProductModel.insertMany(req.body);
    res.send(products);
  } catch (error) {
    console.log(error);
  }
});

productRoute.get("/", auth, async (req, res) => {
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

productRoute.put("/:id",auth, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).send(JSON.stringify(updatedProduct));
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating the product");
  }
});

productRoute.delete("/:id",auth, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await ProductModel.findByIdAndRemove(id);
    if (deletedProduct) {
      res.status(200).send(JSON.stringify(deletedProduct));
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting the product");
  }
});

productRoute.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    let product = await ProductModel.findById({ _id: id });
    res.status(200).send(JSON.stringify(product));
  } catch (err) {
    console.log(err);
  }
});

module.exports = { productRoute };
