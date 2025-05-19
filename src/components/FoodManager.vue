<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h5">Quản lý món ăn</h1>
        <v-btn color="primary" @click="openForm()">➕ Thêm món</v-btn>

        <v-data-table
          :headers="headers"
          :items="foods"
          class="mt-4"
          dense
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="openForm(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteFood(item._id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <food-form
      :editedFood="selectedFood"
      :dialog="formDialog"
      @save="saveFood"
      @close="formDialog = false"
    />
  </v-container>
</template>

<script>
import axios from 'axios'
import FoodForm from './FoodForm.vue'

export default {
  components: { FoodForm },
  data() {
    return {
      formDialog: false,
      selectedFood: null,
      foods: [],
      headers: [
        { text: 'Tên món', value: 'name' },
        { text: 'Giá', value: 'price' },
        { text: 'Hành động', value: 'actions', sortable: false },
      ],
    }
  },
  mounted() {
    this.fetchFoods()
  },
  methods: {
    openForm(food = null) {
      // Nếu món ăn tồn tại, tạo bản sao để sửa; nếu không thì null
      this.selectedFood = food ? { ...food } : null
      this.formDialog = true
    },

    async fetchFoods() {
      try {
        const res = await axios.get('http://localhost:3000/api/foods')
        this.foods = res.data
      } catch (err) {
        console.error('Lỗi tải danh sách món ăn:', err)
      }
    },

    async saveFood(food) {
      try {
        if (food._id) {
          // Sửa món: dùng _id
          await axios.put(`http://localhost:3000/api/foods/${food._id}`, food)
        } else {
          // Thêm món
          await axios.post('http://localhost:3000/api/foods', food)
        }
        this.fetchFoods()
        this.formDialog = false
      } catch (err) {
        console.error('Lỗi khi lưu món ăn:', err)
      }
    },

    async deleteFood(id) {
      if (!confirm('Bạn có chắc muốn xoá món này?')) return
      try {
        await axios.delete(`http://localhost:3000/api/foods/${id}`)
        this.fetchFoods()
      } catch (err) {
        console.error('Lỗi khi xoá món ăn:', err)
      }
    },
  },
}
</script>
