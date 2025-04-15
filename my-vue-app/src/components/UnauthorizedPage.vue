<template>
  <div class="unauthorized-container">
    <h1>401 - Unauthorized</h1>
    <p>Your session has expired. Please log in again.</p>
    <router-link to="/login">Go to Login</router-link>
  </div>
</template>

<style scoped>
.unauthorized-container {
  text-align: center;
  margin-top: 50px;
}
</style>
