const express = require('express');
const auth = require('../controllers/auth');
const product = require('../controllers/product'); 
const authenticateToken = require('../middleware/tokenMiddleware');

const router = express.Router()

// auth
router.post('/sign-up', auth.signUp)
router.post('/log-in', auth.logIn)

// product
router.post('/create_product', product.createProduct);
router.delete('/remove_product/:id', product.removeProduct);
router.get('/plants/:id', product.getPlantById);
router.get('/plants/indoor', product.getIndoorPlants);
router.get('/plants/outdoor', product.getOutdoorPlants);
router.get('/page', product.paginateProducts);
router.post('/cart/increment', authenticateToken, product.incrementCartItem);
router.post('/cart/decrement', authenticateToken, product.decrementCartItem);

module.exports = router
