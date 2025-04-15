<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { usePostStore } from '../../../stores/PostStore';
import { postService } from '../../../services/postService';
import { useLoadingStore } from '../../../stores/LoadingStore';
import PostCard from './Card.vue';
import PostModal from './Modal.vue';

const postStore = usePostStore();
const loadingStore = useLoadingStore();
const search = ref('');
const startDate = ref('');
const endDate = ref('');
const showDateFilter = ref(false);

// Debounce search input
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
watch(search, (newVal) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    postStore.setSearch(newVal);
  }, 500);
});

// Get posts with pagination using Vue Query
const { data, isLoading, error, isError } = useQuery({
  queryKey: ['posts', computed(() => postStore.pagedParams)],
  queryFn: async () => {
    // Manual handling of loading state for Vue Query
    if (isLoading) {
      loadingStore.startLoading('Loading posts...');
    }
    try {
      const result = await postService.getPosts(postStore.pagedParams);
      return result;
    } finally {
      loadingStore.stopLoading();
    }
  },
  refetchOnWindowFocus: false,    // Disable refetching when window gains focus
  refetchOnMount: true,           // Only fetch on initial mount
  refetchOnReconnect: false,      // Disable refetching on reconnect
  staleTime: 5 * 60 * 1000,  
  placeholderData: (prevData) => prevData ?? undefined, 
});

// Apply date filters
const applyDateFilter = () => {
  const formattedStartDate = startDate.value ? new Date(startDate.value).toISOString() : null;
  const formattedEndDate = endDate.value ? new Date(endDate.value + 'T23:59:59').toISOString() : null;
  postStore.setDateRange(formattedStartDate, formattedEndDate);
  showDateFilter.value = false; // Close dropdown after applying filter
};

// Clear date filters
const clearDateFilter = () => {
  startDate.value = '';
  endDate.value = '';
  postStore.clearDateRange();
  showDateFilter.value = false; // Close dropdown after clearing filter
};

// Toggle date filter visibility
const toggleDateFilter = () => {
  showDateFilter.value = !showDateFilter.value;
};

// Close date filter when clicking outside
const closeDateFilter = (event: MouseEvent) => {
  const dateFilterEl = document.querySelector('.date-filter') as HTMLElement;
  if (showDateFilter.value && dateFilterEl && !dateFilterEl.contains(event.target as Node)) {
    showDateFilter.value = false;
  }
};

// Add and remove click event listener for closing dropdown
onMounted(() => {
  document.addEventListener('click', closeDateFilter);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDateFilter);
});

// Computed values for pagination
const totalPages = computed(() => data.value ? Math.ceil(data.value.totalCount / postStore.pagedParams.pageSize) : 0);
const currentPage = computed(() => postStore.pagedParams.page);
const displayedPages = computed(() => {
  const pages = [];
  const startPage = Math.max(1, currentPage.value - 2);
  const endPage = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    postStore.setPage(page);
  }
};

// Create new post
const handleCreatePost = () => {
  postStore.openCreateModal();
};
</script>

<template>
  <div class="post-management-container">
    <div class="header-section">
      <h1 class="main-title">Post Management</h1>
      <button class="primary-button" @click="handleCreatePost">Create New Post</button>
    </div>
    
    <div class="filters-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="search" 
          placeholder="Search posts..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="date-filter">
        <button @click="toggleDateFilter" class="filter-toggle-btn">
          {{ showDateFilter ? 'Hide Date Filter' : 'Filter by Date' }}
        </button>
        
        <div v-if="showDateFilter" class="date-picker-container">
          <div class="date-inputs">
            <div class="date-input-group">
              <label for="start-date">From</label>
              <input 
                type="date" 
                id="start-date" 
                v-model="startDate" 
                class="date-input"
                :max="endDate || undefined"
              />
            </div>
            
            <div class="date-input-group">
              <label for="end-date">To</label>
              <input 
                type="date" 
                id="end-date" 
                v-model="endDate" 
                class="date-input"
                :min="startDate || undefined"
              />
            </div>
          </div>
          
          <div class="date-filter-actions">
            <button @click="applyDateFilter" class="apply-filter-btn">Apply</button>
            <button @click="clearDateFilter" class="clear-filter-btn">Clear</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Show active filters indicator if date filter is applied -->
    <div v-if="postStore.pagedParams.startDate || postStore.pagedParams.endDate" class="active-filters">
      <div class="active-filter-tag">
        <span>Date Filter: </span>
        <span v-if="postStore.pagedParams.startDate">
          From: {{ new Date(postStore.pagedParams.startDate).toLocaleDateString() }}
        </span>
        <span v-if="postStore.pagedParams.endDate">
          To: {{ new Date(postStore.pagedParams.endDate).toLocaleDateString() }}
        </span>
        <button @click="clearDateFilter" class="clear-tag-btn">×</button>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-if="isError" class="error-state">
      <p>{{ (error as Error).message || 'Failed to load posts' }}</p>
      <button @click="() => postStore.setPage(1)" class="retry-button">Try Again</button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="data && data.items.length === 0" class="empty-state">
      <p>No posts available. Create your first post!</p>
      <button @click="handleCreatePost" class="primary-button">Create Post</button>
    </div>
    
    <!-- Data loaded successfully -->
    <div v-else-if="data" class="posts-grid">
      <PostCard 
        v-for="post in data.items" 
        :key="post.id" 
        :post="post"
      />
    </div>
    
    <div v-if="data && data.totalCount > 0" class="pagination-controls">
      <button 
        class="page-nav-button"
        :class="{ disabled: currentPage <= 1 }"
        :disabled="currentPage <= 1" 
        @click="goToPage(currentPage - 1)"
      >
        &lt;
      </button>
      
      <div class="page-numbers">
        <button 
          v-if="currentPage > 3" 
          class="page-number-button" 
          @click="goToPage(1)"
        >
          1
        </button>
        
        <span v-if="currentPage > 3" class="page-ellipsis">...</span>
        
        <button 
          v-for="page in displayedPages" 
          :key="page" 
          class="page-number-button" 
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        
        <span v-if="currentPage < totalPages - 2" class="page-ellipsis">...</span>
        
        <button 
          v-if="currentPage < totalPages - 2" 
          class="page-number-button" 
          @click="goToPage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </div>
      
      <button 
        class="page-nav-button"
        :class="{ disabled: currentPage >= totalPages }"
        :disabled="currentPage >= totalPages" 
        @click="goToPage(currentPage + 1)"
      >
        &gt;
      </button>
    </div>
    
    <!-- Post Modal for Create/Edit -->
    <PostModal />
  </div>
</template>

<style lang="sass" scoped>
.post-management-container
  padding: 2rem

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

.primary-button
  padding: 0.7rem 1.2rem
  background-color: #4caf50
  color: white
  border: none
  border-radius: 4px
  font-size: 1rem
  cursor: pointer
  font-weight: 500
  transition: background-color 0.2s
  white-space: nowrap

  &:hover
    background-color: #45a049

@media (max-width: 576px)
  .header-section
    flex-direction: column
    align-items: flex-start
    
  .main-title
    font-size: 1.6rem
    margin-bottom: 0.5rem
    
  .primary-button
    align-self: flex-start
    padding: 0.5rem 1rem
    font-size: 0.9rem

.search-section
  margin-bottom: 2rem
  width: 100%

.filters-section
  display: flex
  flex-wrap: wrap
  gap: 1rem
  margin-bottom: 1.5rem
  align-items: flex-start
  width: 100%
  justify-content: space-between

.search-box
  position: relative
  flex: 1
  min-width: 200px
  max-width: 100%
  margin-right: 1rem

.search-input
  width: 100%
  padding: 0.75rem 1rem 0.75rem 2.5rem
  border: 1px solid #ddd
  border-radius: 4px
  font-size: 1rem
  transition: border-color 0.2s

  &:focus
    outline: none
    border-color: #2196F3

.search-icon
  position: absolute
  left: 0.75rem
  top: 50%
  transform: translateY(-50%)
  color: #888
  font-size: 1.2rem
  pointer-events: none

.date-filter
  position: relative
  display: flex
  flex-direction: column
  gap: 0.5rem
  min-width: 150px

.filter-toggle-btn
  background-color: #f5f5f5
  border: 1px solid #ddd
  padding: 0.75rem 1rem
  border-radius: 4px
  cursor: pointer
  transition: all 0.2s
  font-size: 0.9rem
  
  &:hover
    background-color: #e9e9e9

.date-picker-container
  background-color: white
  border: 1px solid #ddd
  border-radius: 4px
  padding: 1rem
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  min-width: 300px
  position: absolute
  z-index: 10
  right: 0

.date-inputs
  display: flex
  gap: 1rem
  margin-bottom: 1rem
  flex-wrap: wrap
  
  @media (max-width: 576px)
    flex-direction: column

.date-input-group
  display: flex
  flex-direction: column
  gap: 0.3rem
  flex: 1
  
  label
    font-size: 0.9rem
    color: #555

.date-input
  padding: 0.5rem
  border: 1px solid #ddd
  border-radius: 4px
  width: 100%
  
  &:focus
    outline: none
    border-color: #2196F3

.date-filter-actions
  display: flex
  gap: 0.5rem
  justify-content: flex-end

.apply-filter-btn
  background-color: #2196F3
  color: white
  border: none
  padding: 0.5rem 1rem
  border-radius: 4px
  cursor: pointer
  
  &:hover
    background-color: #0b7dda

.clear-filter-btn
  background-color: #f5f5f5
  border: 1px solid #ddd
  padding: 0.5rem 1rem
  border-radius: 4px
  cursor: pointer
  
  &:hover
    background-color: #e9e9e9

.active-filters
  display: flex
  gap: 0.5rem
  margin-bottom: 1.5rem
  flex-wrap: wrap

.active-filter-tag
  display: flex
  align-items: center
  gap: 0.3rem
  background-color: #e3f2fd
  border: 1px solid #bbdefb
  padding: 0.3rem 0.6rem
  border-radius: 4px
  font-size: 0.85rem
  
  span
    white-space: nowrap

.clear-tag-btn
  background: none
  border: none
  cursor: pointer
  color: #555
  font-size: 1.2rem
  display: flex
  align-items: center
  justify-content: center
  margin-left: 0.3rem
  
  &:hover
    color: #f44336

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

.posts-grid
  display: grid
  grid-template-columns: 1fr  // 1 column for mobile by default
  gap: 2rem
  margin-bottom: 2rem

@media (min-width: 768px)
  .posts-grid
    grid-template-columns: repeat(2, 1fr)  // 2 columns for tablet

@media (min-width: 1200px)
  .posts-grid
    grid-template-columns: repeat(3, 1fr)  // 3 columns for desktop

// Pagination styles
.pagination-controls
  display: flex
  justify-content: center
  align-items: center
  margin-top: 2rem
  margin-bottom: 2rem
  user-select: none

.page-nav-button
  width: 40px
  height: 40px
  border: none
  background-color: #f5f5f5
  border-radius: 50%
  font-size: 1rem
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  transition: all 0.2s
  margin: 0 0.5rem

  &:hover:not(.disabled)
    background-color: #e0e0e0

  &.disabled
    opacity: 0.5
    cursor: not-allowed

.page-numbers
  display: flex
  align-items: center

.page-number-button
  width: 40px
  height: 40px
  border: none
  background-color: #ffffff
  border: 1px solid #e0e0e0
  border-radius: 50%
  margin: 0 0.25rem
  font-size: 0.95rem
  cursor: pointer
  transition: all 0.2s

  &:hover
    background-color: #f5f5f5

  &.active
    background-color: #2196F3
    color: white
    border-color: #2196F3
    font-weight: 500

.page-ellipsis
  width: 32px
  text-align: center
  font-size: 1.2rem
  color: #757575

// Responsive styles for filters
@media (max-width: 768px)
  .filters-section
    flex-direction: column
    align-items: stretch
    gap: 1rem
    
  .search-box
    margin-right: 0
    margin-bottom: 1rem
    max-width: 100%
    
  .date-filter
    width: 100%
    
  .date-picker-container
    width: 100%
    min-width: unset
    position: relative
    right: auto
</style>
