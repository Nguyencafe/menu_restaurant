const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Thêm trường name, bắt buộc
  items: [
    {
      _id: { type: String, required: true }, // ID của món ăn từ collection foods
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active' } // Trạng thái menu
});

module.exports = mongoose.model('Menu', menuSchema);