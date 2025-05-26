const express = require('express');
const router = express.Router();
const { createMenu, getAllMenus, deleteMenu, updateMenu,getMenuById } = require('../controllers/menuController');

// Định nghĩa các route
router.post('/', createMenu); // POST /api/menu
router.get('/', getAllMenus); // GET /api/menus
router.get('/:id', getMenuById); // GET /api/menus/:id
router.delete('/:id', deleteMenu); // DELETE /api/menus/:id
router.put('/:id', updateMenu); // PUT /api/menus/:id


module.exports = router;