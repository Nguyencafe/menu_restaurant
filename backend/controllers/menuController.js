const Menu = require('../models/menu');

const createMenu = async (req, res) => {
  try {
    const { name, layout } = req.body; // Đổi 'menu' thành 'items'
    if (!name || !layout || !Array.isArray(layout)) {
      return res.status(400).json({ message: 'Dữ liệu menu không hợp lệ' });
    }
    const newMenu = new Menu({ name, layout });
    console.log('Before saving:', newMenu);
    await newMenu.save();
    console.log('After saving:', newMenu);
    res.status(201).json(newMenu);
  } catch (err) {
    console.error('Error saving menu:', err);
    res.status(400).json({ message: err.message });
  }
};

// Lấy tất cả menu
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa menu
const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Không tìm thấy menu' });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật menu
const updateMenu = async (req, res) => {
  try {
    const { name, layout } = req.body;
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, layout },
      { new: true }
    );
    if (!menu) return res.status(404).json({ message: 'Không tìm thấy menu' });
    res.json(menu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy chi tiết một menu
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Không tìm thấy menu' });
    res.json(menu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createMenu, getAllMenus, deleteMenu, updateMenu, getMenuById };