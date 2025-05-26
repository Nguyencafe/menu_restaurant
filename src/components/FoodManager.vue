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
          <template v-slot:item.price="{ item }">
            {{ item.price.toLocaleString('vi-VN') }} đ
          </template>
          <template v-slot:item.image="{ item }">
            <v-img
              v-if="item.image"
              :src="item.image"
              max-width="50"
              max-height="50"
              class="my-1"
            />
            <span v-else>Không có ảnh</span>
          </template>
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
      :edited-food="selectedFood"
      :dialog="formDialog"
      @save="saveFood"
      @close="formDialog = false"
    />
  </v-container>
</template>

<script>
import axios from 'axios';
import FoodForm from './FoodForm.vue';
import { EventBus } from '../event-bus';

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
        { text: 'Mô tả', value: 'description' },
        { text: 'Danh mục', value: 'category' },
        { text: 'Ảnh', value: 'image', sortable: false },
        { text: 'Hành động', value: 'actions', sortable: false },
      ],
    };
  },
  mounted() {
    this.fetchFoods();
    EventBus.$emit('foods-updated');
  },
  methods: {
    openForm(food = null) {
      this.selectedFood = food ? { ...food } : null;
      this.formDialog = true;
    },

    async fetchFoods() {
      try {
        const res = await axios.get('http://localhost:3000/api/foods', { timeout: 5000 });
        this.foods = res.data.map(item => ({
          _id: item._id.toString(),
          name: item.name || 'Không có tên',
          price: Number(item.price) || 0,
          description: item.description || '',
          category: item.category || '',
          image: item.image || '',
        }));
      } catch (err) {
        this.$root.$emit('snackbar', {
          text: `Lỗi tải danh sách món ăn: ${err.response?.data?.message || err.message}`,
          color: 'error',
        });
        console.error('Lỗi tải danh sách món ăn:', err);
      }
    },

    async saveFood(food) {
      try {
        if (food._id) {
          await axios.put(`http://localhost:3000/api/foods/${food._id}`, food);
        } else {
          await axios.post('http://localhost:3000/api/foods', food);
        }
        this.fetchFoods();
        EventBus.$emit('foods-updated');
        this.formDialog = false;
        this.$root.$emit('snackbar', {
          text: 'Món ăn đã được lưu thành công!',
          color: 'success',
        });
      } catch (err) {
        this.$root.$emit('snackbar', {
          text: `Lỗi khi lưu món ăn: ${err.response?.data?.message || err.message}`,
          color: 'error',
        });
        console.error('Lỗi khi lưu món ăn:', err);
      }
    },

    async deleteFood(id) {
      if (!confirm('Bạn có chắc muốn xoá món này?')) return;
      try {
        await axios.delete(`http://localhost:3000/api/foods/${id}`);
        this.fetchFoods();
        EventBus.$emit('foods-updated');
        this.$root.$emit('snackbar', {
          text: 'Món ăn đã được xóa thành công!',
          color: 'success',
        });
      } catch (err) {
        this.$root.$emit('snackbar', {
          text: `Lỗi khi xoá món ăn: ${err.response?.data?.message || err.message}`,
          color: 'error',
        });
        console.error('Lỗi khi xoá món ăn:', err);
      }
    },
  },
};
</script>