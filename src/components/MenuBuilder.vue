<template>
  <v-container v-if="isAuthenticated">
    <v-row>
      <!-- Menu đang thiết kế -->
      <v-col cols="12" md="8">
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
            <v-row class="mb-2">
              <v-btn small color="primary" @click="addTitleBlock">Thêm tiêu đề</v-btn>
              <v-btn small color="secondary" @click="addTextBlock">Thêm đoạn văn</v-btn>
              <v-btn small color="info" @click="addImageBlock">Thêm ảnh</v-btn>
              <v-btn small color="success" @click="addLineBlock">Thêm đường kẻ</v-btn>
              <v-btn small color="warning" @click="addShapeBlock">Thêm hình dạng</v-btn>
              <v-btn small color="error" @click="openLayerManager">Quản lý layers</v-btn>
              <v-btn small color="purple" @click="openColorPalette">Chọn bảng màu</v-btn>
              <v-btn small color="teal" @click="applyTemplate">Áp dụng template</v-btn>
              <v-btn small color="indigo" @click="exportToImage">Xuất ảnh</v-btn>
              <v-btn small color="pink" @click="printMenu">In thẻ lều bàn</v-btn>
              <v-select
                v-model="paperSize"
                :items="paperSizes"
                label="Kích thước giấy"
                class="ml-2"
                style="max-width: 150px;"
              />
              <v-btn small color="grey" @click="alignBlocks('left')">Căn trái</v-btn>
              <v-btn small color="grey" @click="alignBlocks('center')">Căn giữa</v-btn>
              <v-btn small color="grey" @click="alignBlocks('right')">Căn phải</v-btn>
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleImageUpload"
              />
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
              :style="{ backgroundColor: colorPalette }"
            >
              <grid-item
                v-for="item in layout"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                class="menu-block"
                :class="{ 'selected-block': selectedBlocks.includes(item.i) }"
                @click="selectBlock(item.i, $event)"
              >
                <div v-if="item.type === 'menuItem'" class="food-item">
                  <v-img
                    v-if="item.data.image"
                    :src="item.data.image"
                    alt="Ảnh món ăn"
                    max-width="50"
                    max-height="50"
                    class="mr-2"
                    style="float:left; margin-right: 12px;"
                  ></v-img>
                  <div class="food-header">
                    <div class="food-name">{{ item.data.name }}</div>
                    <div class="food-price">{{ formatPrice(item.data.price) }} đ</div>
                  </div>
                  <div v-if="item.data.description" class="food-description">
                    {{ item.data.description }}
                  </div>
                  <v-btn icon small @click.stop="removeFromLayout(item.i)" class="remove-btn">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </div>
                <!-- Block tiêu đề - CẬP NHẬT: Thêm @dblclick -->
                <div v-else-if="item.type === 'title'" @dblclick="editBlock(item)" class="title-block">
                  <h3
                    :style="{
                      color: item.data.color,
                      textAlign: item.data.align,
                      fontSize: item.data.fontSize + 'px',
                      fontFamily: item.data.fontFamily,
                      fontStyle: item.data.fontStyle === 'italic' ? 'italic' : 'normal',
                      fontWeight: item.data.fontStyle === 'bold' ? 'bold' : 'normal',
                      lineHeight: item.data.lineHeight,
                      letterSpacing: item.data.letterSpacing + 'px',
                      textShadow: item.data.effect === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
                      border: item.data.effect === 'border' ? '1px solid #000' : 'none'
                    }"
                  >
                    {{ item.data.text }}
                  </h3>
                  <v-btn icon small @click.stop="removeFromLayout(item.i)" class="remove-btn">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </div>
                <!-- Block đoạn văn - CẬP NHẬT: Thêm @dblclick -->
                <div v-else-if="item.type === 'text'" @dblclick="editBlock(item)" class="text-block">
                  <p
                    :style="{
                      color: item.data.color,
                      textAlign: item.data.align,
                      fontSize: item.data.fontSize + 'px',
                      fontFamily: item.data.fontFamily,
                      fontStyle: item.data.fontStyle === 'italic' ? 'italic' : 'normal',
                      fontWeight: item.data.fontStyle === 'bold' ? 'bold' : 'normal',
                      lineHeight: item.data.lineHeight,
                      letterSpacing: item.data.letterSpacing + 'px',
                      textShadow: item.data.effect === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
                      border: item.data.effect === 'border' ? '1px solid #000' : 'none'
                    }"
                  >
                    {{ item.data.text }}
                  </p>
                  <v-btn icon small @click.stop="removeFromLayout(item.i)" class="remove-btn">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </div>
                <div v-else-if="item.type === 'image'" class="image-block">
                  <v-img
                    :src="item.data.url"
                    :alt="item.data.alt"
                    height="120"
                    max-width="100%"
                    contain
                    class="rounded"
                  ></v-img>
                  <v-btn icon small @click.stop="removeFromLayout(item.i)" class="remove-btn">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </div>
                <div v-else-if="item.type === 'line'" class="line-block">
                  <div
                    :style="{
                      borderTop: `${item.data.thickness}px ${item.data.lineStyle} ${item.data.color}`,
                      width: '100%',
                      height: '100%'
                    }"
                  ></div>
                  <v-btn icon small @click.stop="removeFromLayout(item.i)" class="remove-btn">
                    <v-icon color="error">mdi-close</v-icon>
                  </v-btn>
                </div>
                <div v-else-if="item.type === 'shape'" class="shape-block">
                  <div
                    :style="{
                      backgroundColor: item.data.color,
                      width: '100%',
                      height: '100%',
                      borderRadius: item.data.shape === 'circle' ? '50%' : '4px'
                    }"
                  ></div>
                  <v-btn icon small @click.stop="removeFromLayout(item.i)" class="remove-btn">
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
      <v-col cols="12" md="4">
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
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title>Chỉnh sửa block</v-card-title>
        <v-card-text>
          <v-text-field
            v-if="editBlockData && editBlockData.text !== undefined"
            v-model="editBlockData.text"
            label="Nội dung"
          ></v-text-field>
          <v-select
            v-if="editBlockData && editBlockData.text !== undefined"
            v-model="editBlockData.fontFamily"
            :items="fontFamilies"
            label="Phông chữ"
          ></v-select>
          <v-select
            v-if="editBlockData && editBlockData.text !== undefined"
            v-model="editBlockData.fontStyle"
            :items="fontStyles"
            label="Kiểu chữ"
          ></v-select>
          <v-slider
            v-if="editBlockData && editBlockData.text !== undefined"
            v-model="editBlockData.lineHeight"
            min="1"
            max="3"
            step="0.1"
            label="Khoảng cách dòng"
          ></v-slider>
          <v-slider
            v-if="editBlockData && editBlockData.text !== undefined"
            v-model="editBlockData.letterSpacing"
            min="0"
            max="5"
            step="0.1"
            label="Khoảng cách chữ"
          ></v-slider>
          <v-select
            v-if="editBlockData && editBlockData.text !== undefined"
            v-model="editBlockData.effect"
            :items="effects"
            label="Hiệu ứng"
          ></v-select>
          <v-text-field
            v-if="editBlockData && editBlockData.url !== undefined"
            v-model="editBlockData.url"
            label="Link ảnh"
          ></v-text-field>
          <v-btn
            v-if="editBlockData && editBlockData.url !== undefined"
            @click="openCropDialog"
          >
            Crop ảnh
          </v-btn>
          <v-select
            v-if="editBlockData && editBlockData.type === 'line'"
            v-model="editBlockData.lineStyle"
            :items="lineStyles"
            label="Kiểu đường kẻ"
          ></v-select>
          <v-color-picker
            v-if="editBlockData && (editBlockData.type === 'line' || editBlockData.type === 'shape' || editBlockData.color !== undefined)"
            v-model="editBlockData.color"
            label="Màu"
            flat
          ></v-color-picker>
          <v-slider
            v-if="editBlockData && editBlockData.type === 'line'"
            v-model="editBlockData.thickness"
            min="1"
            max="10"
            label="Độ dày"
          ></v-slider>
          <v-select
            v-if="editBlockData && editBlockData.type === 'shape'"
            v-model="editBlockData.shape"
            :items="shapes"
            label="Hình dạng"
          ></v-select>
          <v-slider
            v-if="editBlockData && editBlockData.fontSize !== undefined"
            v-model="editBlockData.fontSize"
            min="12"
            max="48"
            label="Cỡ chữ"
          ></v-slider>
          <v-select
            v-if="editBlockData && editBlockData.align !== undefined"
            v-model="editBlockData.align"
            :items="['left', 'center', 'right']"
            label="Căn lề"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="saveEditBlock">Lưu</v-btn>
          <v-btn color="grey" text @click="editDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog crop ảnh -->
    <v-dialog v-model="cropDialog" max-width="600">
      <v-card>
        <v-card-title>Crop ảnh</v-card-title>
        <v-card-text>
          <vue-cropper ref="cropper" :src="editBlockData ? editBlockData.url : ''" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="cropImage">Crop</v-btn>
          <v-btn @click="cropDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog quản lý layers -->
    <v-dialog v-model="layerDialog" max-width="400">
      <v-card>
        <v-card-title>Quản lý layers</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(item, index) in layout" :key="item.i">
              <v-list-item-content>
                <v-list-item-title>{{ item.type }} - {{ item.i }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="moveLayerUp(index)">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn icon @click="moveLayerDown(index)">
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="layerDialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog chọn bảng màu -->
    <v-dialog v-model="colorPaletteDialog" max-width="400">
      <v-card>
        <v-card-title>Chọn bảng màu</v-card-title>
        <v-card-text>
          <v-color-picker v-model="colorPalette" flat></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="colorPaletteDialog = false">Lưu</v-btn>
          <v-btn color="grey" text @click="colorPaletteDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                <div
                  :style="{
                    color: item.data.color,
                    textAlign: item.data.align,
                    fontSize: item.data.fontSize + 'px',
                    fontFamily: item.data.fontFamily,
                    fontStyle: item.data.fontStyle === 'italic' ? 'italic' : 'normal',
                    fontWeight: item.data.fontStyle === 'bold' ? 'bold' : 'normal',
                    lineHeight: item.data.lineHeight,
                    letterSpacing: item.data.letterSpacing + 'px',
                    textShadow: item.data.effect === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
                    border: item.data.effect === 'border' ? '1px solid #000' : 'none'
                  }"
                >
                  {{ item.data.text }}
                </div>
                <v-btn icon small @click="removeFromLayout(item.i)">
                  <v-icon color="error">mdi-close</v-icon>
                </v-btn>
              </div>
              <div v-else-if="item.type === 'text'" @dblclick="editBlock(item)">
                <div
                  :style="{
                    color: item.data.color,
                    textAlign: item.data.align,
                    fontSize: item.data.fontSize + 'px',
                    fontFamily: item.data.fontFamily,
                    fontStyle: item.data.fontStyle === 'italic' ? 'italic' : 'normal',
                    fontWeight: item.data.fontStyle === 'bold' ? 'bold' : 'normal',
                    lineHeight: item.data.lineHeight,
                    letterSpacing: item.data.letterSpacing + 'px',
                    textShadow: item.data.effect === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
                    border: item.data.effect === 'border' ? '1px solid #000' : 'none'
                  }"
                >
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
              <div v-else-if="item.type === 'line'" @dblclick="editBlock(item)">
                <div
                  :style="{
                    borderTop: `${item.data.thickness}px ${item.data.lineStyle} ${item.data.color}`,
                    width: '100%',
                    height: '100%'
                  }"
                ></div>
                <v-btn icon small @click="removeFromLayout(item.i)">
                  <v-icon color="error">mdi-close</v-icon>
                </v-btn>
              </div>
              <div v-else-if="item.type === 'shape'" @dblclick="editBlock(item)">
                <div
                  :style="{
                    backgroundColor: item.data.color,
                    width: '100%',
                    height: '100%',
                    borderRadius: item.data.shape === 'circle' ? '50%' : '4px'
                  }"
                ></div>
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

    <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-container>
  <v-container v-else>
    <v-alert type="warning">
      Vui lòng đăng nhập để truy cập chức năng này.
      <v-btn to="/login" color="primary" class="ml-2">Đăng nhập</v-btn>
    </v-alert>
  </v-container>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';
import { GridLayout, GridItem } from 'vue-grid-layout';
import VueCropper from 'vue-cropperjs';
import html2canvas from 'html2canvas';
import { EventBus } from '../event-bus';

export default {
  name: 'MenuBuilder',
  components: {
    draggable,
    GridLayout,
    GridItem,
    VueCropper
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
      editDialog: false,
      editBlockIndex: null,
      editBlockData: null,
      cropDialog: false,
      layerDialog: false,
      colorPaletteDialog: false,
      selectedBlocks: [],
      paperSize: 'A4',
      paperSizes: ['A4', 'A3', 'Custom'],
      fontFamilies: ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'],
      fontStyles: ['normal', 'italic', 'bold'],
      lineStyles: ['solid', 'dashed', 'dotted'],
      shapes: ['rectangle', 'circle'],
      effects: ['none', 'shadow', 'border'],
      colorPalette: '#f9f9f9',
      templates: [
        {
          name: 'Template 1',
          layout: [
            { x: 0, y: 0, w: 12, h: 1, i: 'title1', type: 'title', data: { text: 'Menu', color: '#222', align: 'center', fontSize: 24 } },
            { x: 0, y: 1, w: 12, h: 1, i: 'line1', type: 'line', data: { lineStyle: 'solid', color: '#000', thickness: 2 } }
          ]
        }
      ]
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
    isValidMenu() {
      return this.menuName && this.layout.length > 0;
    }
  },
  mounted() {
    if (this.isAuthenticated) {
      this.fetchFoods();
      this.fetchMenus();
    }
    EventBus.$on('foods-updated', this.fetchFoods);
  },
  beforeDestroy() {
    EventBus.$off('foods-updated', this.fetchFoods);
  },
  methods: {
    formatPrice(price) {
      return Number(price).toLocaleString('vi-VN');
    },
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
            image: item.image || 'https://via.placeholder.com/50'
          }));
        } else {
          throw new Error('Dữ liệu API không phải mảng');
        }
      } catch (err) {
        this.error = `Lỗi tải danh sách món ăn: ${err.response?.data?.message || err.message}`;
        if (err.response?.status === 401) {
          this.snackbarText = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          this.snackbarColor = 'error';
          this.$router.push('/login');
        } else {
          this.snackbarText = this.error;
          this.snackbarColor = 'error';
        }
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
            image: item.image || 'https://via.placeholder.com/50'
          }));
        } else {
          throw new Error('Dữ liệu API không phải mảng');
        }
      } catch (err) {
        this.error = `Lỗi tải danh sách menu: ${err.response?.data?.message || err.message}`;
        if (err.response?.status === 401) {
          this.snackbarText = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          this.snackbarColor = 'error';
          this.$router.push('/login');
        } else {
          this.snackbarText = this.error;
          this.snackbarColor = 'error';
        }
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    async viewMenuDetails(menuId) {
      try {
        this.loading = true;
        const res = await axios.get(`http://localhost:3000/api/menus/${menuId}`, { timeout: 5000 });
        this.layout = res.data.layout || [];
        this.menuName = res.data.name || '';
        this.selectedMenuId = menuId;
      } catch (err) {
        this.error = `Lỗi tải chi tiết menu: ${err.response?.data?.message || err.message}`;
        if (err.response?.status === 401) {
          this.snackbarText = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          this.snackbarColor = 'error';
          this.$router.push('/login');
        } else {
          this.snackbarText = this.error;
          this.snackbarColor = 'error';
        }
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
        image: food.image || 'https://via.placeholder.com/50'
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
        data: this.cloneFood(food)
      };
      this.layout.push(newItem);
    },
    addTitleBlock() {
      this.layout.push({
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        i: String(Date.now()) + '-title',
        type: 'title',
        data: { text: 'Tiêu đề mới', color: '#222', align: 'center', fontSize: 24, fontFamily: 'Arial', fontStyle: 'normal', lineHeight: 1.5, letterSpacing: 0, effect: 'none' }
      });
    },
    addTextBlock() {
      this.layout.push({
        x: 0,
        y: 1,
        w: 12,
        h: 2,
        i: String(Date.now()) + '-text',
        type: 'text',
        data: { text: 'Nội dung mô tả...', color: '#444', align: 'left', fontSize: 16, fontFamily: 'Arial', fontStyle: 'normal', lineHeight: 1.5, letterSpacing: 0, effect: 'none' }
      });
    },
    addImageBlock() {
      this.$refs.imageInput.click();
    },
    addLineBlock() {
      this.layout.push({
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        i: String(Date.now()) + '-line',
        type: 'line',
        data: { lineStyle: 'solid', color: '#000', thickness: 2 }
      });
    },
    addShapeBlock() {
      this.layout.push({
        x: 0,
        y: 0,
        w: 2,
        h: 2,
        i: String(Date.now()) + '-shape',
        type: 'shape',
        data: { shape: 'rectangle', color: '#000' }
      });
    },
    removeFromLayout(id) {
      this.layout = this.layout.filter(item => item.i !== id);
      this.selectedBlocks = this.selectedBlocks.filter(i => i !== id);
    },
    editBlock(item) {
      this.editBlockIndex = this.layout.findIndex(i => i.i === item.i);
      this.editBlockData = JSON.parse(JSON.stringify({ ...item.data, type: item.type }));
      this.editDialog = true;
    },
    saveEditBlock() {
      if (this.editBlockIndex !== null && this.editBlockData) {
        this.$set(this.layout[this.editBlockIndex], 'data', { ...this.editBlockData });
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
          layout: this.layout
        };
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
          if (err.response.status === 401) {
            this.snackbarText = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
            this.snackbarColor = 'error';
            this.$router.push('/login');
            return;
          }
        } else {
          errorMsg += `: ${err.message}`;
        }
        this.error = errorMsg;
        this.snackbarText = errorMsg;
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.layout.push({
          x: 0,
          y: 0,
          w: 6,
          h: 4,
          i: String(Date.now()) + '-img',
          type: 'image',
          data: { url: e.target.result, alt: file.name }
        });
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    },
    async updateMenu() {
      try {
        if (!this.selectedMenuId) throw new Error('Không có menu được chọn');
        await axios.put(`http://localhost:3000/api/menus/${this.selectedMenuId}`, {
          name: this.menuName,
          layout: this.layout
        });
        this.snackbarText = 'Menu đã được cập nhật thành công!';
        this.snackbarColor = 'success';
        this.snackbar = true;
        this.updateMenuDialog = false;
        this.fetchMenus();
      } catch (err) {
        this.error = `Lỗi khi cập nhật menu: ${err.response?.data?.message || err.message}`;
        if (err.response?.status === 401) {
          this.snackbarText = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          this.snackbarColor = 'error';
          this.$router.push('/login');
        } else {
          this.snackbarText = this.error;
          this.snackbarColor = 'error';
        }
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
        if (err.response?.status === 401) {
          this.snackbarText = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          this.snackbarColor = 'error';
          this.$router.push('/login');
        } else {
          this.snackbarText = this.error;
          this.snackbarColor = 'error';
        }
        this.snackbar = true;
      }
    },
    selectMenu(menuId) {
      this.selectedMenuId = menuId;
    },
    selectBlock(id, event) {
      if (event.ctrlKey) {
        if (this.selectedBlocks.includes(id)) {
          this.selectedBlocks = this.selectedBlocks.filter(i => i !== id);
        } else {
          this.selectedBlocks.push(id);
        }
      } else {
        this.selectedBlocks = [id];
      }
    },
    alignBlocks(align) {
      if (this.selectedBlocks.length === 0) return;
      this.layout = this.layout.map(item => {
        if (this.selectedBlocks.includes(item.i) && (item.type === 'title' || item.type === 'text')) {
          item.data.align = align;
        } else if (this.selectedBlocks.includes(item.i)) {
          if (align === 'left') item.x = 0;
          else if (align === 'center') item.x = Math.floor((12 - item.w) / 2);
          else if (align === 'right') item.x = 12 - item.w;
        }
        return item;
      });
    },
    openLayerManager() {
      this.layerDialog = true;
    },
    moveLayerUp(index) {
      if (index > 0) {
        const temp = this.layout[index];
        this.$set(this.layout, index, this.layout[index - 1]);
        this.$set(this.layout, index - 1, temp);
      }
    },
    moveLayerDown(index) {
      if (index < this.layout.length - 1) {
        const temp = this.layout[index];
        this.$set(this.layout, index, this.layout[index + 1]);
        this.$set(this.layout, index + 1, temp);
      }
    },
    openCropDialog() {
      this.cropDialog = true;
    },
    cropImage() {
      const croppedImage = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.editBlockData.url = croppedImage;
      this.cropDialog = false;
    },
    openColorPalette() {
      this.colorPaletteDialog = true;
    },
    applyTemplate() {
      if (this.templates.length > 0) {
        this.layout = JSON.parse(JSON.stringify(this.templates[0].layout));
      }
    },
    async exportToImage() {
      const element = document.querySelector('.grid-area');
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${this.menuName || 'menu'}.png`;
      link.click();
    },
    printMenu() {
      window.print();
    }
  }
};
</script>

<style scoped>
.grid-area {
  min-height: 400px;
  border-radius: 8px;
  padding: 16px;
}

.menu-block {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.menu-block:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.selected-block {
  border: 2px solid #2196f3;
}

.food-item {
  padding: 16px;
  position: relative;
}

.food-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.food-name {
  font-weight: 700;
  font-size: 18px;
  flex: 1;
}

.food-price {
  font-weight: 600;
  color: #e53935;
  margin-left: 16px;
  font-size: 16px;
}

.food-description {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.title-block {
  padding: 16px;
  background-color: #f5f5f5;
  text-align: center;
}

.title-block h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.text-block {
  padding: 16px;
}

.text-block p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

.image-block {
  position: relative;
  padding: 8px;
  min-height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.line-block {
  position: relative;
}

.shape-block {
  position: relative;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.remove-btn:hover {
  opacity: 1;
}
</style>