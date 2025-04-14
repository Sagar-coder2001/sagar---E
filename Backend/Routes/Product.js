const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProductById } = require('../Controller/Product');
const { jwtmiddleware } = require('../jwt');

const router = express.Router();
// products
router.post('/' , jwtmiddleware, createProduct)
      .get('/', jwtmiddleware, fetchAllProducts)
      .get('/:id', jwtmiddleware, fetchProductById)
      .patch('/:id', jwtmiddleware, updateProductById)
      
      module.exports = router; 