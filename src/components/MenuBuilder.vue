<template>
  <v-container>
    <v-row>
      <!-- Menu đang thiết kế -->
      <v-col cols="6">
        <v-card outlined class="pa-4" min-height="400">
          <v-card-title class="text-h6">Menu đang thiết kế</v-card-title>
          <v-divider />
          <v-card-text>
            <v-text-field
              v-model="menuName"
              label="Tên menu"
              :rules="[v => !!v || 'Tên menu không được để trống']"
              required
              class="mb-4"
            />
            <draggable
              v-model="menu"
              item-key="_id"
              group="foods"
              class="drag-area pa-2"
              :animation="200"
            >
              <v-list-item
                v-for="item in menu"
                :key="item._id"
                class="menu-item"
              >
                <v-list-item-avatar>
                  <v-img :src="item.image || 'https://via.placeholder.com/50'" aspect-ratio="1" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h6 font-weight-bold">{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle class="text-truncate">{{ item.description || 'Không có mô tả' }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text class="text-right price">
                    {{ item.price.toLocaleString('vi-VN') }} đ
                  </v-list-item-action-text>
                  <v-btn icon small @click="removeFromMenu(item._id)">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </draggable>
            <v-alert v-if="!menu.length" type="info" dense>
              Chưa có món nào trong menu
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="warning"
              :disabled="!selectedMenuId"
              @click="openUpdateMenuDialog"
            >
              Cập nhật Menu
            </v-btn>
            <v-spacer />
            <v-btn
              color="error"
              :disabled="!selectedMenuId"
              @click="deleteMenu"
            >
              Xóa Menu
            </v-btn>
            <v-btn
              color="success"
              :disabled="!menu.length || !menuName"
              @click="saveMenu"
            >
              Lưu Menu
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Danh sách món ăn và Danh sách menu -->
      <v-col cols="6">
        <!-- Danh sách món ăn -->
        <v-card outlined class="pa-4 mb-4">
          <v-card-title class="text-h6">
            Danh sách món ăn
            <v-spacer />
            <v-btn icon small @click="fetchFoods" :loading="loading">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-progress-linear
              v-if="loading"
              indeterminate
              color="primary"
              class="mb-2"
            />
            <v-alert v-if="error" type="error" dense class="mb-2">
              {{ error }}
            </v-alert>
            <draggable
              v-model="foods"
              group="foods"
              :clone="cloneFood"
              :sort="false"
              item-key="_id"
              class="drag-list"
            >
              <v-list-item
                v-for="item in foods"
                :key="item._id"
                class="menu-item"
                draggable
              >
                <v-list-item-avatar>
                  <v-img :src="item.image || 'https://via.placeholder.com/50'" aspect-ratio="1" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h6 font-weight-bold">{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle class="text-truncate">{{ item.description || 'Không có mô tả' }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text class="text-right price">
                    {{ item.price.toLocaleString('vi-VN') }} đ
                  </v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </draggable>
            <v-alert v-if="!foods.length && !loading && !error" type="info" dense>
              Không có món ăn nào
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Danh sách menu -->
        <v-card outlined class="pa-4">
          <v-card-title class="text-h6">
            Danh sách menu
            <v-spacer />
            <v-btn icon small @click="fetchMenus" :loading="loading">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-progress-linear
              v-if="loading"
              indeterminate
              color="primary"
              class="mb-2"
            />
            <v-alert v-if="error" type="error" dense class="mb-2">
              {{ error }}
            </v-alert>
            <v-list>
              <v-list-item
                v-for="menuItem in menus"
                :key="menuItem._id"
                @click="selectMenu(menuItem._id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ menuItem.name || 'Menu không tên' }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small @click.stop="viewMenuDetails(menuItem._id)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-alert v-if="!menus.length && !loading && !error" type="info" dense>
              Không có menu nào
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog cập nhật menu -->
    <v-dialog v-model="updateMenuDialog" max-width="500">
      <v-card>
        <v-card-title>Cập nhật Menu</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="menuName"
            label="Tên menu"
            :rules="[v => !!v || 'Tên menu không được để trống']"
            required
          />
          <draggable
            v-model="menu"
            item-key="_id"
            group="foods"
            class="drag-area pa-2"
            :animation="200"
          >
            <v-list-item
              v-for="item in menu"
              :key="item._id"
              class="menu-item"
            >
              <v-list-item-avatar>
                <v-img :src="item.image || 'https://via.placeholder.com/50'" aspect-ratio="1" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-h6 font-weight-bold">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-truncate">{{ item.description || 'Không có mô tả' }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text class="text-right price">
                  {{ item.price.toLocaleString('vi-VN') }} đ
                </v-list-item-action-text>
                <v-btn icon small @click="removeFromMenu(item._id)">
                  <v-icon color="error">mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </draggable>
          <v-alert v-if="!menu.length" type="info" dense>
            Chưa có món nào trong menu
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="updateMenuDialog = false">Huỷ</v-btn>
          <v-btn color="blue darken-1" text @click="updateMenu" :disabled="!isValidMenu">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar thông báo -->
    <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';
import { EventBus } from '../event-bus';

export default {
  name: 'MenuBuilder',
  components: { draggable },
  data() {
    return {
      foods: [],
      menu: [],
      menus: [],
      loading: false,
      error: null,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      selectedMenuId: null,
      updateMenuDialog: false,
      menuName: '',
    };
  },
  computed: {
    isValidMenu() {
      return this.menuName && this.menu.length > 0;
    },
  },
  mounted() {
    this.fetchFoods();
    this.fetchMenus();
    EventBus.$on('foods-updated', this.fetchFoods);
  },
  beforeDestroy() {
    EventBus.$off('foods-updated', this.fetchFoods);
  },
  methods: {
    async fetchFoods() {
      try {
        this.loading = true;
        this.error = null;
        const res = await axios.get('http://localhost:3000/api/foods', { timeout: 5000 });
        if (Array.isArray(res.data)) {
          this.foods = res.data.map(item => ({
            _id: item._id.toString(),
            name: item.name || 'Không có tên',
            price: Number(item.price) || 0,
            description: item.description || '',
            category: item.category || '',
            image: item.image || 'https://via.placeholder.com/50',
          }));
        } else {
          throw new Error('Dữ liệu API không phải mảng');
        }
      } catch (err) {
        this.error = `Lỗi tải danh sách món ăn: ${err.message}`;
        this.snackbarText = this.error;
        this.snackbarColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    async fetchMenus() {
      try {
        this.loading = true;
        this.error = null;
        const res = await axios.get('http://localhost:3000/api/menus', { timeout: 5000 });
        if (Array.isArray(res.data)) {
          this.menus = res.data.map(item => ({
            _id: item._id.toString(),
            name: item.name || 'Menu không tên',
          }));
          console.log('Fetched menus:', this.menus);
        } else {
          throw new Error('Dữ liệu API không phải mảng');
        }
      } catch (err) {
        this.error = `Lỗi tải danh sách menu: ${err.message}`;
        this.snackbarText = this.error;
        this.snackbarColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    async viewMenuDetails(menuId) {
      try {
        this.loading = true;
        const res = await axios.get(`http://localhost:3000/api/menus/${menuId}`, { timeout: 5000 });
        this.menu = res.data.items.map(item => ({
          _id: item._id,
          name: item.name,
          price: Number(item.price),
        }));
        this.menuName = res.data.name || '';
        this.selectedMenuId = menuId;
      } catch (err) {
        this.error = `Lỗi tải chi tiết menu: ${err.message}`;
        this.snackbarText = this.error;
        this.snackbarColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    cloneFood(food) {
      return { ...food };
    },
    removeFromMenu(id) {
      this.menu = this.menu.filter(item => item._id !== id);
    },
    async saveMenu() {
      console.log('Sending data:', { name: this.menuName, menu: this.menu });
      try {
        const response = await axios.post('http://localhost:3000/api/menus', { name: this.menuName, menu: this.menu });
        console.log('Response from saveMenu:', response.data);
        this.snackbarText = 'Menu đã được lưu thành công!';
        this.snackbarColor = 'success';
        this.snackbar = true;
        this.menu = [];
        this.menuName = '';
        this.fetchMenus();
      } catch (err) {
        this.error = `Lỗi khi lưu menu: ${err.response?.data?.message || err.message}`;
        this.snackbarText = this.error;
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    },
    openUpdateMenuDialog() {
      if (this.selectedMenuId) {
        this.updateMenuDialog = true;
      } else {
        this.snackbarText = 'Vui lòng chọn một menu để cập nhật!';
        this.snackbarColor = 'warning';
        this.snackbar = true;
      }
    },
    async updateMenu() {
      console.log('Updating menu with data:', { name: this.menuName, items: this.menu });
      try {
        if (!this.selectedMenuId) throw new Error('Không có menu được chọn');
        const response = await axios.put(`http://localhost:3000/api/menus/${this.selectedMenuId}`, { name: this.menuName, items: this.menu });
        console.log('Response from updateMenu:', response.data);
        this.snackbarText = 'Menu đã được cập nhật thành công!';
        this.snackbarColor = 'success';
        this.snackbar = true;
        this.updateMenuDialog = false;
        this.fetchMenus();
      } catch (err) {
        this.error = `Lỗi khi cập nhật menu: ${err.response?.data?.message || err.message}`;
        this.snackbarText = this.error;
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    },
    async deleteMenu() {
      if (!this.selectedMenuId) {
        this.snackbarText = 'Vui lòng chọn một menu để xóa!';
        this.snackbarColor = 'warning';
        this.snackbar = true;
        return;
      }
      if (!confirm('Bạn có chắc muốn xoá menu này?')) return;
      try {
        await axios.delete(`http://localhost:3000/api/menus/${this.selectedMenuId}`);
        this.snackbarText = 'Menu đã được xóa thành công!';
        this.snackbarColor = 'success';
        this.snackbar = true;
        this.menu = [];
        this.menuName = '';
        this.selectedMenuId = null;
        this.fetchMenus();
      } catch (err) {
        this.error = `Lỗi khi xóa menu: ${err.response?.data?.message || err.message}`;
        this.snackbarText = this.error;
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    },
    selectMenu(menuId) {
      this.selectedMenuId = menuId;
    },
  },
};
</script>

<style scoped>
.drag-area {
  min-height: 300px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
.drag-list {
  min-height: 100px;
}
.menu-item {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  transition: background-color 0.3s;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:hover {
  background-color: #f9f9f9;
}
.price {
  font-weight: 500;
  color: #d32f2f;
  min-width: 80px;
}
</style>