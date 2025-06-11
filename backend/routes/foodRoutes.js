const express = require('express');
const router = express.Router();
const { getAllFoods, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { auth, adminOnly } = require('../middleware/auth');
// Định nghĩa các route
router.get('/', getAllFoods); // GET /api/foods
router.post('/', auth, adminOnly, createFood); // POST /api/foods (chỉ admin)
router.put('/:id', auth, adminOnly, updateFood); // PUT /api/foods/:id (chỉ admin)
router.delete('/:id', auth, adminOnly, deleteFood); // DELETE /api/foods/:id (chỉ admin)

module.exports = router;