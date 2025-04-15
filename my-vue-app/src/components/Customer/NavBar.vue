<script setup lang="ts">
import { LogOut, User } from "lucide-vue-next"; 
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const userEmail = ref(localStorage.getItem("user_email") || "User");

const logout = () => {
  Cookies.remove("auth_token");
  Cookies.remove("user_role");
  Cookies.remove("refresh_count");
  localStorage.removeItem("user_email");
  router.push("/login");
};

</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          Customer Portal
        </router-link>
      </div>
      
      <div class="nav-links">
        <router-link to="/counter" class="nav-item" active-class="active">Counter</router-link>
        <!-- Add more customer links here as needed -->
      </div>
      
      <div class="nav-actions">
        <div class="user-info">
          <User :size="18" />
          <span class="username">{{ userEmail }}</span>
        </div>
        <button @click="logout" class="logout-btn">
          <LogOut :size="18"/> 
          <span class="btn-text">Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style lang="sass" scoped>
.navbar
  display: flex
  align-items: center
  justify-content: space-between
  padding: 0.8rem 1rem
  background: #2c3e50 // Matching Admin dark blue/navy
  color: white
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2)
  width: 100%
  position: fixed // Changed from sticky to fixed for full-screen
  top: 0
  left: 0
  right: 0
  z-index: 100

.container
  display: flex
  justify-content: space-between
  align-items: center
  width: 100%
  max-width: 100% // Changed to 100% for full-screen
  padding: 0 1rem
  margin: 0 auto

.nav-brand
  font-size: 1.4rem
  font-weight: bold
  
  .brand-link
    color: white
    text-decoration: none
    transition: opacity 0.2s
    
    &:hover
      opacity: 0.9

.nav-links
  display: flex
  align-items: center
  gap: 1rem
  
.nav-item
  text-decoration: none
  color: white
  font-weight: 500
  padding: 0.5rem 0.8rem
  border-radius: 4px
  transition: background-color 0.3s
  
  &:hover, &.active
    background-color: rgba(255, 255, 255, 0.1) // Matching Admin hover effect

.nav-actions
  display: flex
  align-items: center
  gap: 1rem

.user-info
  display: flex
  align-items: center
  gap: 0.5rem
  padding: 0.5rem
  border-radius: 4px
  background-color: rgba(255, 255, 255, 0.1)
  
  .username
    font-size: 0.9rem
    max-width: 150px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

.logout-btn
  display: flex
  align-items: center
  gap: 0.5rem
  background-color: #f44336 // Matching Admin logout button color
  color: white
  border: none
  cursor: pointer
  font-weight: 500
  padding: 0.5rem 0.8rem
  border-radius: 4px
  transition: background-color 0.2s
  
  &:hover
    background-color: #d32f2f // Matching Admin logout hover effect

// Responsive adjustments
@media (max-width: 768px)
  .container
    flex-wrap: wrap
    gap: 0.8rem
    
  .nav-brand
    flex-basis: 100%
    margin-bottom: 0.5rem
    
  .nav-links
    flex-grow: 1
    order: 3
    width: 100%
    overflow-x: auto
    padding-bottom: 0.3rem
    
  .username
    display: none
    
  .btn-text
    display: none
</style>
