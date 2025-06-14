<template>
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
</template>

<script>
import FoodManager from './FoodManager.vue';
import MenuBuilder from './MenuBuilder.vue';

export default {
  name: 'DashboardView',
  components: {
    FoodManager,
    MenuBuilder,
  },
  data() {
    return {
      tab: 0,
    };
  },
};
</script>