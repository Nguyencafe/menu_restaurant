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
  </v-app>
</template>

<script>
import FoodManager from './components/FoodManager.vue'
import MenuBuilder from './components/MenuBuilder.vue'

export default {
  name: 'App',
  components: {
    FoodManager,
    MenuBuilder,
  },
  data() {
    return {
      tab: 0,
    }
  },
}
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
