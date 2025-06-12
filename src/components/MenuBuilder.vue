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
            <!-- Nút thêm block -->
            <v-row class="mb-2">
              <v-btn small color="primary" @click="addTitleBlock">Thêm tiêu đề</v-btn>
              <v-btn small color="secondary" @click="addTextBlock">Thêm đoạn văn</v-btn>
              <v-btn small color="info" @click="addImageBlock">Thêm ảnh</v-btn>
            </v-row>
            <grid-layout
              :layout.sync="layout"
              :col-num="12"
              :row-height="30"
              :is-draggable="true"
              :is-resizable="true"
              :vertical-compact="true"
              :use-css-transforms="true"
              class="grid-area"
            >
              <grid-item
                v-for="item in layout"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
              >
                <!-- Block món ăn -->
                <div v-if="item.type === 'menuItem'">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img :src="item.data.image || 'https://via.placeholder.com/50'" aspect-ratio="1" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6 font-weight-bold">{{ item.data.name }}</v-list-item-title>
                      <v-list-item-subtitle class="text-truncate">{{ item.data.description || 'Không có mô tả' }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text class="text-right price">
                        {{ item.data.price.toLocaleString('vi-VN') }} đ
                      </v-list-item-action-text>
                      <v-btn icon small @click="removeFromLayout(item.i)">
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </div>
                <!-- Block tiêu đề -->
                <div v-else-if="item.type === 'title'" @dblclick="editBlock(item)">
                  <div :style="{color: item.data.color, textAlign: item.data.align, fontSize: item.data.fontSize + 'px', fontWeight: 'bold'}">
                    {{ item.data.text }}
                  </div>
                  <v-btn icon small @click="removeFromLayout(item.i)">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </div>
                <!-- Block đoạn văn -->
                <div v-else-if="item.type === 'text'" @dblclick="editBlock(item)">
                  <div :style="{color: item.data.color, textAlign: item.data.align, fontSize: item.data.fontSize + 'px'}">
                    {{ item.data.text }}
                  </div>
                  <v-btn icon small @click="removeFromLayout(item.i)">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </div>
                <!-- Block ảnh -->
                <div v-else-if="item.type === 'image'" @dblclick="editBlock(item)">
                  <v-img :src="item.data.url" :alt="item.data.alt" contain height="100%"></v-img>
                  <v-btn icon small @click="removeFromLayout(item.i)">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </div>
              </grid-item>
            </grid-layout>
            <v-alert v-if="!layout.length" type="info" dense>
              Chưa có thành phần nào trong menu
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
              :disabled="!layout.length || !menuName"
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
                @click="addToLayout(item)"
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

        <!-- Danh sách menu (giữ nguyên) -->
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
                <v-list-item-avatar>
                  <v-img :src="menuItem.image || 'https://via.placeholder.com/50'" aspect-ratio="1" />
                </v-list-item-avatar>
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

    <!-- Dialog chỉnh sửa block -->
    <v-dialog v-model="editDialog" max-width="400">
      <v-card>
        <v-card-title>Chỉnh sửa block</v-card-title>
        <v-card-text>
          <v-text-field v-if="editBlockData && editBlockData.text !== undefined" v-model="editBlockData.text" label="Nội dung"></v-text-field>
          <v-text-field v-if="editBlockData && editBlockData.url !== undefined" v-model="editBlockData.url" label="Link ảnh"></v-text-field>
          <v-color-picker v-if="editBlockData && editBlockData.color !== undefined" v-model="editBlockData.color" label="Màu chữ" flat></v-color-picker>
          <v-slider v-if="editBlockData && editBlockData.fontSize !== undefined" v-model="editBlockData.fontSize" min="12" max="48" label="Cỡ chữ"></v-slider>
          <v-select v-if="editBlockData && editBlockData.align !== undefined" v-model="editBlockData.align" :items="['left','center','right']" label="Căn lề"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" text @click="saveEditBlock">Lưu</v-btn>
          <v-btn color="grey" text @click="editDialog=false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog cập nhật menu (giữ nguyên hoặc điều chỉnh tương tự) -->
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
          <grid-layout
            :layout.sync="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :vertical-compact="true"
            :use-css-transforms="true"
          >
            <grid-item
              v-for="item in layout"
              :key="item.i"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
            >
              <div v-if="item.type === 'menuItem'">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="item.data.image || 'https://via.placeholder.com/50'" aspect-ratio="1" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6 font-weight-bold">{{ item.data.name }}</v-list-item-title>
                    <v-list-item-subtitle class="text-truncate">{{ item.data.description || 'Không có mô tả' }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text class="text-right price">
                      {{ item.data.price.toLocaleString('vi-VN') }} đ
                    </v-list-item-action-text>
                    <v-btn icon small @click="removeFromLayout(item.i)">
                      <v-icon color="error">mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </div>
              <div v-else-if="item.type === 'title'" @dblclick="editBlock(item)">
                <div :style="{color: item.data.color, textAlign: item.data.align, fontSize: item.data.fontSize + 'px', fontWeight: 'bold'}">
                  {{ item.data.text }}
                </div>
                <v-btn icon small @click="removeFromLayout(item.i)">
                  <v-icon color="error">mdi-close</v-icon>
                </v-btn>
              </div>
              <div v-else-if="item.type === 'text'" @dblclick="editBlock(item)">
                <div :style="{color: item.data.color, textAlign: item.data.align, fontSize: item.data.fontSize + 'px'}">
                  {{ item.data.text }}
                </div>
                <v-btn icon small @click="removeFromLayout(item.i)">
                  <v-icon color="error">mdi-close</v-icon>
                </v-btn>
              </div>
              <div v-else-if="item.type === 'image'" @dblclick="editBlock(item)">
                <v-img :src="item.data.url" :alt="item.data.alt" contain height="100%"></v-img>
                <v-btn icon small @click="removeFromLayout(item.i)">
                  <v-icon color="error">mdi-close</v-icon>
                </v-btn>
              </div>
            </grid-item>
          </grid-layout>
          <v-alert v-if="!layout.length" type="info" dense>
            Chưa có thành phần nào trong menu
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
import { GridLayout, GridItem } from 'vue-grid-layout';
import { EventBus } from '../event-bus';

export default {
  name: 'MenuBuilder',
  components: {
    draggable,
    GridLayout,
    GridItem,
  },
  data() {
    return {
      foods: [],
      layout: [],
      menus: [],
      loading: false,
      error: null,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      selectedMenuId: null,
      updateMenuDialog: false,
      menuName: '',
      // Dialog chỉnh sửa block
      editDialog: false,
      editBlockIndex: null,
      editBlockData: null,
    };
  },
  computed: {
    isValidMenu() {
      return this.menuName && this.layout.length > 0;
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
            image: item.image || 'https://via.placeholder.com/50',
          }));
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
        this.layout = res.data.layout || []; // Lấy đúng trường layout
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
      return {
        _id: food._id,
        name: food.name,
        price: food.price,
        description: food.description || '',
        category: food.category || '',
        image: food.image || 'https://via.placeholder.com/50',
      };
    },
    addToLayout(food) {
      const newItem = {
        x: 0,
        y: 0,
        w: 2,
        h: 2,
        i: String(Date.now()) + '-' + Math.random(),
        type: 'menuItem',
        data: this.cloneFood(food),
      };
      this.layout.push(newItem);
    },
    // Thêm block tiêu đề
    addTitleBlock() {
      this.layout.push({
        x: 0, y: 0, w: 12, h: 1, i: String(Date.now()) + '-title', type: 'title',
        data: { text: 'Tiêu đề mới', color: '#222', align: 'center', fontSize: 24 }
      });
    },
    // Thêm block đoạn văn
    addTextBlock() {
      this.layout.push({
        x: 0, y: 1, w: 12, h: 2, i: String(Date.now()) + '-text', type: 'text',
        data: { text: 'Nội dung mô tả...', color: '#444', align: 'left', fontSize: 16 }
      });
    },
    // Thêm block ảnh
    addImageBlock() {
      this.layout.push({
        x: 0, y: 2, w: 6, h: 4, i: String(Date.now()) + '-img', type: 'image',
        data: { url: 'https://via.placeholder.com/150', alt: 'Ảnh minh họa' }
      });
    },
    removeFromLayout(id) {
      this.layout = this.layout.filter(item => item.i !== id);
    },
    // Chỉnh sửa block
    editBlock(item) {
      this.editBlockIndex = this.layout.findIndex(i => i.i === item.i);
      this.editBlockData = JSON.parse(JSON.stringify(item.data));
      this.editDialog = true;
    },
    saveEditBlock() {
      if (this.editBlockIndex !== null && this.editBlockData) {
        this.$set(this.layout[this.editBlockIndex], 'data', {...this.editBlockData});
      }
      this.editDialog = false;
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
   async saveMenu() {
  if (!this.menuName || this.layout.length === 0) {
    this.snackbarText = 'Vui lòng nhập tên menu và thêm ít nhất một thành phần.';
    this.snackbarColor = 'warning';
    this.snackbar = true;
    return;
  }
  try {
    const payload = {
      name: this.menuName,
      layout: this.layout // Lưu toàn bộ layout
      
    };
    console.log('Payload gửi lên:', JSON.stringify(payload, null, 2));
    await axios.post('http://localhost:3000/api/menus', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.snackbarText = 'Menu đã được lưu thành công!';
    this.snackbarColor = 'success';
    this.snackbar = true;
    this.layout = [];
    this.menuName = '';
    this.fetchMenus();
  } catch (err) {
    let errorMsg = 'Lỗi khi lưu menu';
    if (err.response) {
      errorMsg += `: ${err.response.data.message || err.response.statusText}`;
    } else {
      errorMsg += `: ${err.message}`;
    }
    this.error = errorMsg;
    this.snackbarText = errorMsg;
    this.snackbarColor = 'error';
    this.snackbar = true;
  }
},

async updateMenu() {
  try {
    if (!this.selectedMenuId) throw new Error('Không có menu được chọn');
    await axios.put(`http://localhost:3000/api/menus/${this.selectedMenuId}`, {
      name: this.menuName,
      layout: this.layout // Lưu toàn bộ layout
    });
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
        this.layout = [];
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
    }
  }
};
</script>

<style scoped>
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
.grid-area {
  min-height: 300px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>