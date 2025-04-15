<script setup lang="ts">
import NavBar from "../components/Customer/NavBar.vue";
</script>

<template>
  <NavBar />
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<style lang="sass" scoped>
.content
  padding: 20px 15px
  margin-top: 60px
  min-height: calc(100vh - 60px)
  display: flex
  flex-direction: column
  align-items: center

  & > *
    width: 100%
    max-width: 1200px
</style>
