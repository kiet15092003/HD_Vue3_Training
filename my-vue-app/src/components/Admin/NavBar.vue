<script setup lang="ts">
import { ref } from "vue";
import { LogOut, Menu, X } from "lucide-vue-next"; 
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();
const drawerOpen = ref(false);

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

const logout = () => {
  Cookies.remove("auth_token");
  Cookies.remove("user_role");
  Cookies.remove("refresh_count");
  localStorage.removeItem("user_email");
  router.push("/login");
};

</script>

<template>
  <!-- Mobile Hamburger Menu -->
  <div class="admin-mobile-header">
    <button @click="toggleDrawer" class="menu-toggle">
      <Menu v-if="!drawerOpen" :size="24" />
      <X v-else :size="24" />
    </button>
    <h1 class="mobile-title">Admin Panel</h1>
  </div>

  <!-- Navigation Drawer -->
  <aside class="admin-drawer" :class="{ 'drawer-open': drawerOpen }">
    <div class="drawer-header">
      <h2 class="drawer-title">Admin Panel</h2>
      <button @click="toggleDrawer" class="close-drawer-btn">
        <X :size="20" />
      </button>
    </div>
    
    <div class="drawer-content">
      <div class="drawer-nav-links">
        <router-link 
          to="/admin/posts" 
          class="drawer-nav-item" 
          active-class="active"
          @click="drawerOpen = false"
        >
          Posts
        </router-link>
        <router-link 
          to="/admin/users" 
          class="drawer-nav-item" 
          active-class="active"
          @click="drawerOpen = false"
        >
          Users
        </router-link>
      </div>
      
      <div class="drawer-footer">
        <button @click="logout" class="logout-btn">
          <LogOut :size="18" /> Logout
        </button>
      </div>
    </div>
  </aside>
  
  <!-- Overlay for mobile -->
  <div 
    v-if="drawerOpen" 
    class="drawer-overlay"
    @click="drawerOpen = false"
  ></div>
</template>

<style lang="sass" scoped>
// Mobile header
.admin-mobile-header
  display: flex
  align-items: center
  background-color: #2c3e50
  color: white
  padding: 0.8rem 1rem
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 100
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2)

.mobile-title
  margin: 0 0 0 1rem
  font-size: 1.2rem
  font-weight: 500

.menu-toggle
  display: flex
  align-items: center
  justify-content: center
  background: none
  color: white
  border: none
  cursor: pointer
  padding: 0.4rem
  border-radius: 4px
  
  &:hover
    background-color: rgba(255, 255, 255, 0.1)

// Navigation drawer
.admin-drawer
  position: fixed
  top: 0
  left: -280px
  width: 280px
  height: 100vh
  background-color: white
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1)
  transition: left 0.3s ease
  z-index: 200
  display: flex
  flex-direction: column
  
  &.drawer-open
    left: 0

.drawer-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 1rem
  background-color: #2c3e50
  color: white

.drawer-title
  margin: 0
  font-size: 1.2rem
  font-weight: 500

.close-drawer-btn
  display: flex
  align-items: center
  justify-content: center
  background: none
  color: white
  border: none
  cursor: pointer
  padding: 0.4rem
  border-radius: 4px
  
  &:hover
    background-color: rgba(255, 255, 255, 0.1)

.drawer-content
  display: flex
  flex-direction: column
  justify-content: space-between
  flex-grow: 1
  overflow-y: auto

.drawer-nav-links
  display: flex
  flex-direction: column
  padding: 1rem 0

.drawer-nav-item
  display: block
  color: #333
  text-decoration: none
  padding: 0.8rem 1.5rem
  font-size: 1rem
  transition: background-color 0.2s
  
  &:hover, &.active
    background-color: #f0f0f0
  
  &.active
    border-left: 4px solid #2c3e50
    font-weight: 500

.drawer-footer
  padding: 1rem 1.5rem
  border-top: 1px solid #eee

.logout-btn
  display: flex
  align-items: center
  justify-content: center
  gap: 0.5rem
  background-color: #f44336
  color: white
  border: none
  padding: 0.7rem 1rem
  border-radius: 4px
  cursor: pointer
  font-size: 1rem
  width: 100%
  transition: background-color 0.2s
  
  &:hover
    background-color: #d32f2f

// Overlay
.drawer-overlay
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 100

// Content adjust for drawer
.drawer-closed
  padding-left: 280px

// Desktop view
@media (min-width: 768px)
  .admin-mobile-header
    display: none
  
  .admin-drawer
    left: 0
    z-index: 50
    
  .drawer-overlay
    display: none
</style>
