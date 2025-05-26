const Food = require('../models/food');

// Lấy tất cả món ăn
const getAllFoods = async (req, res) => {
  try {
    const { search, priceMax } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
    }
    if (priceMax) {
      query.price = { $lte: parseFloat(priceMax) }; // Lọc theo giá tối đa
    }

    const foods = await Food.find(query);
    res.json(foods);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Tạo món ăn mới
const createFood = async (req, res) => {
  try {
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật món ăn
const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa món ăn
const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllFoods, createFood, updateFood, deleteFood };