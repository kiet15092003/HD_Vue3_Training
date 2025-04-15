<script setup lang="ts">
import type { UserReadDto } from "../../../models/Auth/UserReadDto";

// Props
const props = defineProps<{
  user: UserReadDto;
}>();
</script>

<template>
  <div class="user-card">
    <div class="card-header">
      <h2 class="user-name">{{ user.fullName }}</h2>
    </div>
    
    <div class="card-body">
      <p class="user-email">{{ user.email }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-left: 3px solid #2196F3;
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f1f1;
}

.user-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #333;
  line-height: 1.4;
}

.card-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.user-email {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
}
</style>