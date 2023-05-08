const express = require("express");
const { CartModel } = require("../models/cart.model");
const { auth } = require("../middlewares/auth");
const { default: mongoose, Mongoose } = require("mongoose");
const cartRoute = express.Router();

cartRoute.post("/", auth, async (req, res) => {
  const id = req.body.productId;
  let result;

  const cart = await CartModel.findOne({ user: req.userId });

  if (cart) {
    const alreadyExists = cart.products.find((x) => {
      return x.product.toString() === id;
    });

    let newProducts;
    if (alreadyExists) {
      newProducts = cart.products.map((p) => {
        if (p.product.toString() === id) {
          p.quantity++;
        }
        return p;
      });
    } else {
      newProducts = [...cart.products, { product: id, quantity: 1 }];
    }

    result = await CartModel.findByIdAndUpdate(cart._id, {
      $set: {
        products: newProducts,
      },
    });
  } else {
    const newcart = new CartModel({
      user: req.userId,
      products: [{ product: id, quantity: 1 }],
    });
    result = await newcart.save();
  }
  res.status(200).send(result);
});

cartRoute.patch("/:cartId/quantity", auth, async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity, productId } = req.body;

    console.log(cartId);

    const cart = await CartModel.findById({ _id: cartId });

    if (cart) {
      const newCart = {
        ...cart,
        products: cart.products.map((p) => {
          if (p.product.toString() === productId) {
            p.quantity = quantity;
          }
          return p;
        }),
      };

      const savedCart = await CartModel.findByIdAndUpdate(cartId, newCart, {
        new: true,
      })
        .populate("products.product")
        .populate("user");

      console.log(savedCart);

      res.send(savedCart);
    }

    res.send({
      message: "CartId is malformed",
    });
  } catch (e) {
    console.log(e);
  }
});

cartRoute.get("/", auth, async (req, res) => {
  let cart = await CartModel.findOne({ user: req.userId })
    .populate("products.product")
    .populate("user");

  res.send(cart);
});

module.exports = { cartRoute };
