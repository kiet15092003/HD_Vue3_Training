// filepath: d:\SOFT\Vue-tutorial\my-vue-app\src\components\GlobalSpinner.vue
<script setup lang="ts">
import { useLoadingStore } from "../stores/LoadingStore";
import { computed } from "vue";

const loadingStore = useLoadingStore();
const isLoading = computed(() => loadingStore.isLoading);
const loadingText = computed(() => loadingStore.loadingText);
</script>

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="global-spinner-overlay">
      <div class="global-spinner-container">
        <div class="global-spinner"></div>
        <p class="loading-text">{{ loadingText }}</p>
      </div>
    </div>
  </Transition>
</template>

<style lang="sass" scoped>
.global-spinner-overlay
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center
  z-index: 9999

.global-spinner-container
  display: flex
  flex-direction: column
  align-items: center
  padding: 2rem
  background-color: white
  border-radius: 8px
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

.global-spinner
  width: 50px
  height: 50px
  border: 5px solid #f3f3f3
  border-top: 5px solid #2c3e50
  border-radius: 50%
  animation: spin 1s linear infinite
  margin-bottom: 1rem

.loading-text
  font-size: 1rem
  color: #333
  margin: 0
  font-weight: 500

@keyframes spin
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

// Fade transition
.fade-enter-active, .fade-leave-active
  transition: opacity 0.3s ease

.fade-enter-from, .fade-leave-to
  opacity: 0
</style>