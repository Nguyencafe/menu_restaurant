const express = require('express');
const router = express.Router();
const { getAllFoods, createFood, updateFood, deleteFood } = require('../controllers/foodController');

// Định nghĩa các route
router.get('/', getAllFoods); // GET /api/foods
router.post('/', createFood); // POST /api/foods
router.put('/:id', updateFood); // PUT /api/foods/:id
router.delete('/:id', deleteFood); // DELETE /api/foods/:id

module.exports = router;