const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, fetchAllOrders } = require('../Controller/Order');
const { jwtmiddleware } = require('../jwt');

const router = express.Router();

router.post('/', jwtmiddleware, createOrder)
      .get('/:id', jwtmiddleware, fetchOrdersByUser)
      .delete('/:id', jwtmiddleware, deleteOrder)
      .patch('/:id', jwtmiddleware,  updateOrder)
      .get('/', jwtmiddleware, fetchAllOrders)

module.exports = router;