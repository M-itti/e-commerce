import express from "express";

import { User, Product } from "./model.mjs";

const router = express.Router();

router.post('/create_product', async (req, res) => {
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
      weight 
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
      weight
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating product', error });
  }
});

router.get('/list_products', async (req, res) => {
  res.status(200).send('ok\n');
});

router.get('/update_product', async (req, res) => {
  res.status(200).send('ok\n');
});

router.get('/delete_product', async (req, res) => {
  res.status(200).send('ok\n');
});

export default router;
