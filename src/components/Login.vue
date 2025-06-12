<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Đăng nhập</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="username" label="Username" required></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
              <v-btn type="submit">Login</v-btn>
              <v-btn @click="$router.push('/register')" class="ml-2">Register</v-btn>
            </v-form>
          </v-card-text>
          <v-alert v-if="errorMessage" type="error" class="ma-2">
            {{ errorMessage }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      this.errorMessage = '';
      
      try {
        const response = await axios.post('http://localhost:3000/api/users/login', {
          username: this.username,
          password: this.password
        });
        
        console.log('Login response:', response.data); // Log để kiểm tra dữ liệu trả về
        
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          console.log('Token stored:', response.data.token); // Log token đã lưu
          this.$router.push('/home');
        } else {
          this.errorMessage = 'Đăng nhập thất bại: Không nhận được token từ server';
        }
      } catch (error) {
        this.handleLoginError(error);
      }
    },
    
    handleLoginError(error) {
      if (error.response) {
        console.error('Login error:', error.response.data); // Log chi tiết lỗi
        switch (error.response.status) {
          case 401:
            this.errorMessage = 'Sai tên đăng nhập hoặc mật khẩu';
            break;
          case 400:
            this.errorMessage = 'Yêu cầu không hợp lệ';
            break;
          case 500:
            this.errorMessage = 'Lỗi server, vui lòng thử lại sau';
            break;
          default:
            this.errorMessage = `Lỗi không xác định: ${error.response.data.message || error.message}`;
        }
      } else {
        this.errorMessage = 'Không thể kết nối đến server';
        console.error('Network error:', error.message);
      }
    }
  }
};
</script>