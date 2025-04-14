const express = require('express');
const { updateUser, fetchUserById } = require('../Controller/User');

const router = express.Router();

router.get('/:id', fetchUserById)
      .patch('/:id', updateUser )  

      module.exports = router; 