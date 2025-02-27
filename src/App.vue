<script setup>
import NavBar from './views/navbar/NavBar.vue';
</script>

<template>
  <router-view></router-view>
  <NavBar></NavBar>
</template>

<style scoped>
.test {
  background-color: red;
  width: 200px;
  height: 200px;
}
</style>
