<template>
  <v-container>
    <v-row>
      <!-- Menu đang thiết kế -->
      <v-col cols="7">
        <h2 class="text-h6 font-weight-bold">Menu đang thiết kế</h2>
        <v-card height="400px" class="pa-2">
          <draggable v-model="menuFoods" group="foods" @end="onDragEnd" item-key="_id">
            <template #item="{ element, index }">
              <v-chip class="ma-2" close @click:close="removeFromMenu(index)">
                {{ element.name }} - {{ element.price.toLocaleString() }} đ
              </v-chip>
            </template>
            <template #placeholder>
              <v-chip class="ma-2" outlined>Thả món ăn vào đây</v-chip>
            </template>
          </draggable>
        </v-card>
        <v-btn color="success" class="mt-2" @click="saveMenu">Lưu Menu</v-btn>
      </v-col>

      <!-- Danh sách món ăn -->
      <v-col cols="5">
        <v-card>
          <v-card-title>
            <span class="text-h6 font-weight-medium">Danh sách món ăn</span>
            <v-spacer />
            <v-btn icon @click="fetchFoods">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <draggable
              :list="foods"
              group="foods"
              sort="false"
              item-key="_id"
            >
              <template #item="{ element }">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ element.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ element.price.toLocaleString() }} đ</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </draggable>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  data() {
    return {
      foods: [],
      menuFoods: [],
    }
  },
  mounted() {
    this.fetchFoods()
  },
  methods: {
    async fetchFoods() {
      try {
        const res = await axios.get('http://localhost:3000/api/foods')
        // Mongo trả về _id, để dễ xử lý bạn có thể map lại id nếu cần
        this.foods = res.data.map(food => ({
          ...food,
          id: food._id,  // giữ id nếu dùng ở chỗ khác
        }))
      } catch (err) {
        console.error('Lỗi tải danh sách món ăn:', err)
      }
    },
    removeFromMenu(index) {
      this.menuFoods.splice(index, 1)
    },
    onDragEnd() {
      // Bạn có thể xử lý sau khi kéo thả xong nếu cần
    },
    saveMenu() {
      // Ví dụ gửi menuFoods lên backend (phần này bạn tự xây dựng API)
      console.log('Menu cần lưu:', this.menuFoods)
      alert('Menu đã được lưu (giả lập)')
    },
  },
}
</script>
