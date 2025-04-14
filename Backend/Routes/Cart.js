const express = require('express');
const { addToCart, fetchCartsByUser, deleteCart, updateCart } = require('../Controller/Cart');
const { jwtmiddleware } = require('../jwt');

const router = express.Router();

router.post('/', jwtmiddleware, addToCart)
      .get('/', jwtmiddleware, fetchCartsByUser)
      .delete('/:id', jwtmiddleware, deleteCart)
      .patch('/:id', jwtmiddleware, updateCart)


module.exports = router;