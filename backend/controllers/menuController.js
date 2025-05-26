const Menu = require('../models/menu');

// Tạo menu mới
const createMenu = async (req, res) => {
  console.log('Received request body:', req.body); // Thêm log
  try {
    const { name, menu } = req.body;
    if (!name || !menu || !Array.isArray(menu)) {
      return res.status(400).json({ message: 'Dữ liệu menu không hợp lệ' });
    }
    const newMenu = new Menu({ name, items: menu });
    console.log('Before saving:', newMenu); // Thêm log
    await newMenu.save();
    console.log('After saving:', newMenu); // Thêm log
    res.status(201).json(newMenu);
  } catch (err) {
    console.error('Error saving menu:', err); // Thêm log lỗi
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
    const { name, items } = req.body;
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, items },
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