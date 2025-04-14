const express = require('express');
const { fetchBrands, createBrand } = require('../Controller/Brand');
const { jwtmiddleware } = require('../jwt');

const router = express.Router();
//  /brands is already added in base path
router.get('/', jwtmiddleware, fetchBrands).post('/', jwtmiddleware, createBrand);

module.exports = router;