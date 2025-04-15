<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useUserListStore } from '../../../stores/User/userListStore';
import { userService } from '../../../services/User/userService';
import { useLoadingStore } from '../../../stores/LoadingStore';

const userListStore = useUserListStore();
const loadingStore = useLoadingStore();
const isInitialLoad = ref(true);

// Use vue-query for data fetching
const { data, isLoading, error, isError, refetch } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    try {
      // Only show global spinner on initial load
      if (isInitialLoad.value) {
        loadingStore.startLoading('Loading users...');
      }
      const result = await userService.getUsers();
      return result;
    } finally {
      if (isInitialLoad.value) {
        loadingStore.stopLoading();
        isInitialLoad.value = false;
      }
    }
  },
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: false,
  staleTime: 5 * 60 * 1000,
  placeholderData: (prevData) => prevData ?? undefined,
});

// Create a computed property to safely handle the error message
const errorMessage = computed(() => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Failed to load users';
});

// Create a wrapper function for refetch to handle the MouseEvent
const handleRefetch = () => {
  loadingStore.startLoading('Refreshing users...');
  refetch().finally(() => {
    loadingStore.stopLoading();
  });
};
</script>

<template>
  <div class="user-management-container">
    <div class="header-section">
      <h1 class="main-title">User List</h1>
    </div>
    
    <!-- Error state -->
    <div v-if="isError" class="error-state">
      <p>{{ errorMessage }}</p>
      <button @click="handleRefetch" class="retry-button">Try Again</button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!data?.data?.length" class="empty-state">
      <p>No users available.</p>
    </div>
    
    <!-- Data loaded successfully -->
    <div v-else class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in data?.data" :key="user.email" class="user-row">
            <td>{{ user.email }}</td>
            <td>{{ user.email }}</td>
            <td><span class="user-role">Role Name</span></td>
            <td class="actions-cell">
              <button class="action-button view-button">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.user-management-container
  max-width: 1200px
  margin: 0 auto

.header-section
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 2rem
  flex-wrap: wrap
  gap: 1rem

.main-title
  font-size: 2rem
  font-weight: 600
  margin: 0
  color: #333

.error-state,
.empty-state
  padding: 3rem
  text-align: center
  background-color: #f9f9f9
  border-radius: 8px
  margin-bottom: 2rem

.retry-button
  padding: 0.5rem 1rem
  background-color: #2196F3
  color: white
  border: none
  border-radius: 4px
  margin-top: 1rem
  cursor: pointer

  &:hover
    background-color: #0b7dda

// Table styles for row-based layout
.users-table-container
  width: 100%
  overflow-x: auto
  background-color: white
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

.users-table
  width: 100%
  border-collapse: collapse
  
  th
    text-align: left
    padding: 1rem
    font-weight: 600
    color: #333
    border-bottom: 2px solid #f0f0f0
    white-space: nowrap
  
  td
    padding: 1rem
    border-bottom: 1px solid #f0f0f0
    vertical-align: middle
  
  tbody tr
    transition: background-color 0.2s
    
    &:hover
      background-color: #f9f9f9

.user-role
  display: inline-block
  padding: 0.3rem 0.6rem
  font-size: 0.8rem
  font-weight: 500
  border-radius: 50px
  background-color: #e3f2fd
  color: #1976d2
  text-transform: capitalize

.actions-cell
  white-space: nowrap
  text-align: right

.action-button
  padding: 0.4rem 0.8rem
  border: none
  border-radius: 4px
  font-size: 0.9rem
  cursor: pointer
  margin-left: 0.5rem
  transition: background-color 0.2s, transform 0.1s

.view-button
  background-color: #4caf50
  color: white
  
  &:hover
    background-color: #45a049
    transform: translateY(-2px)

// Mobile responsiveness
@media (max-width: 768px)
  .users-table
    th, td
      padding: 0.8rem 0.5rem
    
    th:nth-child(3), td:nth-child(3)
      display: none
</style>