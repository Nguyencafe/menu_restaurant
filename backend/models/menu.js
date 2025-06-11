const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Thêm trường name, bắt buộc
  items: [
    {
      _id: { type: String, required: true }, // ID của món ăn từ collection foods
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, default: '' }, // Thêm trường description
      image: { type: String, default: 'https://via.placeholder.com/50' }, // Thêm trường image với giá trị mặc định
      category: { type: String, default: '' }, // Thêm trường category
    },
  ],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active' } // Trạng thái menu
});

module.exports = mongoose.model('Menu', menuSchema);