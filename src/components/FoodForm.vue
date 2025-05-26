<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ form.id ? 'Sửa món' : 'Thêm món' }}</span>
      </v-card-title>

      <v-card-text>
        <v-text-field
          label="Tên món"
          v-model="form.name"
          :rules="[v => !!v || 'Tên món không được để trống']"
          required
        />
        <v-text-field
          label="Giá (VNĐ)"
          v-model.number="form.price"
          type="number"
          :rules="[v => v > 0 || 'Giá phải lớn hơn 0']"
          required
        />
        <v-text-field
          label="Mô tả"
          v-model="form.description"
        />
        <v-text-field
          label="Danh mục"
          v-model="form.category"
        />
        <v-text-field
          label="Link ảnh"
          v-model="form.image"
          hint="Nhập URL của ảnh món ăn"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="$emit('close')">Huỷ</v-btn>
        <v-btn color="blue darken-1" text @click="submit" :disabled="!isValid">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    editedFood: {
      type: Object,
      default: null,
    },
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        price: 0,
        description: '',
        category: '',
        image: '',
      },
    };
  },
  computed: {
    isValid() {
      return this.form.name && this.form.price > 0;
    },
  },
  watch: {
    editedFood: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = {
            id: newVal._id || null,
            name: newVal.name || '',
            price: Number(newVal.price) || 0,
            description: newVal.description || '',
            category: newVal.category || '',
            image: newVal.image || '',
          };
        } else {
          this.form = { id: null, name: '', price: 0, description: '', category: '', image: '' };
        }
      },
    },
  },
  methods: {
    submit() {
      if (!this.isValid) return;
      const payload = {
        _id: this.form.id,
        name: this.form.name,
        price: Number(this.form.price),
        description: this.form.description,
        category: this.form.category,
        image: this.form.image,
      };
      this.$emit('save', payload);
      this.form = { id: null, name: '', price: 0, description: '', category: '', image: '' };
    },
  },
};
</script>