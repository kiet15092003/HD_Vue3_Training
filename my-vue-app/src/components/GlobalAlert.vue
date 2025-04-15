<script setup lang="ts">

import { useAlertStore } from '@/stores/Alert/alertStore';
const alertStore = useAlertStore();

</script>

<template>
  <transition name="fade">
    <div v-if="alertStore.visible" :class="['alert', alertStore.type]">
      {{ alertStore.message }}
    </div>
  </transition>
</template>

<style scoped lang="css">
.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 300px; 
  text-align: left; 
}

.success {
  background: #28a745;
}
.error {
  background: #dc3545;
}
.warning {
  background: #ffc107;
  color: black;
}
.info {
  background: #17a2b8;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
