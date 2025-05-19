<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ form.id ? 'Sửa món' : 'Thêm món' }}</span>
      </v-card-title>

      <v-card-text>
        <v-text-field label="Tên món" v-model="form.name" required />
        <v-text-field label="Giá (VNĐ)" v-model="form.price" type="number" required />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="$emit('close')">Huỷ</v-btn>
        <v-btn color="blue darken-1" text @click="submit">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['editedFood', 'dialog'],
  data() {
    return {
      form: {
        id: null,
        name: '',
        price: 0,
      },
    }
  },
  watch: {
    editedFood: {
      immediate: true,
      handler(newVal) {
        this.form = newVal ? { ...newVal } : { id: null, name: '', price: 0 }
      },
    },
  },
  methods: {
    submit() {
      if (!this.form.name || this.form.price <= 0) return
      this.$emit('save', { ...this.form })
    },
  },
}
</script>
