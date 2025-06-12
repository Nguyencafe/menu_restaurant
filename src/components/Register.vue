<template>
  <v-form @submit.prevent="register">
    <v-text-field v-model="username" label="Username" required></v-text-field>
    <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
    <v-text-field v-model="email" label="Email" required></v-text-field>
    <v-btn type="submit">Register</v-btn>
  </v-form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterForm',
  data() {
    return {
      username: '',
      password: '',
      email: ''
    };
  },
  methods: {
    async register() {
      try {
        await axios.post('http://localhost:3000/api/users/register', {
          username: this.username,
          password: this.password,
          email: this.email
        });
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>