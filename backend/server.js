const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const foodRoutes = require('./routes/foodRoutes'); // Import routes cho món ăn
const menuRoutes = require('./routes/menuRoutes'); // Import routes cho menu
const userRoutes = require('./routes/userRoutes'); // Import routes cho user

const app = express();
const PORT = 3000;

// Thay YOUR_MONGO_URI bằng chuỗi kết nối MongoDB của bạn
const MONGO_URI = 'mongodb://localhost:27017/menu-restaurant';

app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Đã kết nối MongoDB'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Gắn routes
app.use('/api/foods', foodRoutes); // Routes cho món ăn
app.use('/api/menu', menuRoutes); // Routes cho menu
app.use('/api/menus', menuRoutes); // Routes cho menu (GET)
app.use('/api/users', userRoutes); // Routes cho user



app.listen(PORT, () => {
  console.log(`Backend server chạy tại http://localhost:${PORT}`);
});