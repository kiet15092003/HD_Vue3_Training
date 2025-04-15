<template>
  <div class="counter-container">
    <h1>Customer Counter</h1>
    <p>Current Count: {{ count }}</p>
    <div class="button-group">
      <button @click="simulateSlowIncrement">Slow Increment (2s)</button>
      <button @click="simulateSlowDecrement">Slow Decrement (2s)</button>
    </div>
    <div class="button-group">
      <button @click="increment">Instant Increment</button>
      <button @click="decrement">Instant Decrement</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCounterStore } from "@/stores/counter";
import { useLoadingStore } from "@/stores/LoadingStore";

const counterStore = useCounterStore();
const loadingStore = useLoadingStore();
const count = computed(() => counterStore.count);

function increment() {
  counterStore.increment();
}

function decrement() {
  counterStore.decrement();
}

// Example of manually controlling the loading state
async function simulateSlowIncrement() {
  loadingStore.startLoading("Incrementing counter...");
  
  try {
    // Simulate a slow operation with a promise
    await new Promise(resolve => setTimeout(resolve, 2000));
    counterStore.increment();
  } finally {
    loadingStore.stopLoading();
  }
}

async function simulateSlowDecrement() {
  loadingStore.startLoading("Decrementing counter...");
  
  try {
    // Simulate a slow operation with a promise
    await new Promise(resolve => setTimeout(resolve, 2000));
    counterStore.decrement();
  } finally {
    loadingStore.stopLoading();
  }
}
</script>

<style scoped>
.counter-container {
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #42b983;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.button-group {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #369f77;
}
</style>
