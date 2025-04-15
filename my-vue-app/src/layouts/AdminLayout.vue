<script setup lang="ts">
import NavBar from "../components/Admin/NavBar.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const isDesktop = ref(window.innerWidth >= 768);

const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 768;
};

onMounted(() => {
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div class="admin-layout">
    <NavBar />
    <main class="main-content" :class="{ 'with-drawer': isDesktop }">
      <router-view></router-view>
    </main>
  </div>
</template>

<style lang="sass" scoped>
.admin-layout
  min-height: 100vh
  display: flex
  flex-direction: column

.main-content
  padding: 20px 40px
  margin-top: 60px
  min-height: calc(100vh - 60px)
  transition: margin-left 0.3s ease
  display: flex
  flex-direction: column
  align-items: center

  & > *
    width: 100%
    max-width: 1200px

  &.with-drawer
    margin-left: 290px
    margin-top: 0
    min-height: 100vh

@media (min-width: 768px)
  .main-content
    margin-top: 0
</style>
