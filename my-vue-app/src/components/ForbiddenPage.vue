<template>
  <div class="unauthorized-container">
    <h1>403 - Forbidden</h1>
    <p>You not have pemission to access this page</p>
    <router-link to="/login">Go to Login</router-link>
  </div>
</template>

<style scoped>
.unauthorized-container {
  text-align: center;
  margin-top: 50px;
}
</style>
