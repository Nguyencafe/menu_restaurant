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
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" to="/login" text>Đăng nhập</v-btn>
      <v-btn v-if="!isAuthenticated" to="/register" text>Đăng ký</v-btn>
      <v-btn v-if="isAuthenticated" to="/dashboard" text>Dashboard</v-btn>
      <v-btn v-if="isAuthenticated" @click="logout" text>Đăng xuất</v-btn>
    </v-app-bar>

    <!-- Nội dung chính -->
    <v-main>
      <v-container>
        <router-view></router-view>
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
export default {
  name: 'App',
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
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