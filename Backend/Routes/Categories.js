const express = require('express');
const { fetchCategories, createCategory } = require('../Controller/Category');
const { jwtmiddleware } = require('../jwt');

const router = express.Router();
//  /categories is already added in base path


router.get('/', jwtmiddleware, fetchCategories)
      .post('/', jwtmiddleware, createCategory)

module.exports = router;