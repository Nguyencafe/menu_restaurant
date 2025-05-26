<template>
  <v-app>
    <!-- Thanh điều hướng -->
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.svg"
          transition="scale-transition"
          width="40"
        />
        <span class="hidden-sm-and-down font-weight-bold text-h6 ml-2">
          MENU RESTAURANT
        </span>
      </div>
    </v-app-bar>

    <!-- Nội dung chính -->
    <v-main>
      <v-container>
        <v-tabs v-model="tab" background-color="grey lighten-4" grow>
          <v-tab>QUẢN LÝ MÓN ĂN</v-tab>
          <v-tab>XÂY DỰNG MENU</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <food-manager />
          </v-tab-item>
          <v-tab-item>
            <menu-builder />
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-main>

    <!-- Snackbar thông báo -->
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import FoodManager from './components/FoodManager.vue';
import MenuBuilder from './components/MenuBuilder.vue';

export default {
  name: 'App',
  components: {
    FoodManager,
    MenuBuilder,
  },
  data() {
    return {
      tab: 0,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
    };
  },
  created() {
    // Lắng nghe sự kiện snackbar từ các component con
    this.$root.$on('snackbar', (payload) => {
      this.snackbarText = payload.text;
      this.snackbarColor = payload.color;
      this.snackbar = true;
    });
  },
  beforeDestroy() {
    // Hủy lắng nghe sự kiện khi component bị hủy
    this.$root.$off('snackbar');
  },
};
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>