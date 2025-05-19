const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const Food = require('./models/food')

const app = express()
const PORT = 3000

// Thay YOUR_MONGO_URI bằng chuỗi kết nối MongoDB của bạn
const MONGO_URI = 'mongodb://localhost:27017/menu-restaurant' 

app.use(cors())
app.use(bodyParser.json())

// Kết nối MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Đã kết nối MongoDB'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err))

// GET tất cả món ăn
app.get('/api/foods', async (req, res) => {
  const foods = await Food.find()
  res.json(foods)
})

// POST tạo món ăn mới
app.post('/api/foods', async (req, res) => {
  try {
    const newFood = new Food(req.body)
    await newFood.save()
    res.status(201).json(newFood)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT cập nhật món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn' })
    res.json(food)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server chạy tại http://localhost:${PORT}`)
})
