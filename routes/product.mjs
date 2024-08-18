import paginate from "mongoose-paginate-v2";
import express from "express";

import { ObjectId } from "mongodb";

import { User, Product, mongoose, Cart } from "./model.mjs";
import { authenticateToken } from "./auth.mjs";

const router = express.Router();

router.post("/create_product", async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      stockQuantity,
      availability,
      category,
      subcategory,
      price,
      material,
      color,
      size,
      manufacturer,
      weight,
    } = req.body;

    const product = new Product({
      productName,
      productDescription,
      stockQuantity,
      availability,
      category,
      subcategory,
      price,
      material,
      color,
      size,
      manufacturer,
      weight,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating product", error });
  }
});

router.delete("/remove_product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = new ObjectId(id);

    const result = await Product.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product", error });
  }
});

router.get("/plants/:id", async (req, res) => {
  try {
    const plantId = req.params.id;
    const plant = await Product.findById(plantId);

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    res.status(200).json(plant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the plant" });
  }
});

router.get("/plants/indoor", async (req, res) => {
  try {
    const indoorPlants = await Product.find({ category: "Indoor Plants" });

    res.status(200).json(indoorPlants);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching indoor plants" });
  }
});

router.get("/plants/outdoor", async (req, res) => {
  try {
    const indoorPlants = await Product.find({ category: "Outdoor Plants" });

    res.status(200).json(indoorPlants);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching indoor plants" });
  }
});

router.get("/products", async (req, res) => {
  const { page = 1, limit = 1 } = req.query;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      collation: {
        locale: "en",
      },
    };

    const result = await Product.paginate({}, options);

    res.json({
      products: result.docs,
      totalDocs: result.totalDocs,
      limit: result.limit,
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage,
      hasPrevPage: result.hasPrevPage,
      prevPage: result.prevPage,
      pagingCounter: result.pagingCounter,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving products" });
  }
});

router.post("/cart/increment", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).send("Product ID is required.");
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send("Cart not found.");
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += 1;
    } else {
      return res.status(404).send("Item not found in cart.");
    }

    await cart.save();
    res.status(200).send("Item quantity incremented successfully.");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Server error. Please try again later.");
  }
});

router.post("/cart/decrement", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).send("Product ID is required.");
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send("Cart not found.");
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity -= 1;

      // Optionally remove item if quantity falls to 0
      if (cart.items[existingItemIndex].quantity <= 0) {
        cart.items.splice(existingItemIndex, 1);
      }
    } else {
      return res.status(404).send("Item not found in cart.");
    }

    await cart.save();
    res.status(200).send("Item quantity decremented successfully.");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Server error. Please try again later.");
  }
});

export default router;
