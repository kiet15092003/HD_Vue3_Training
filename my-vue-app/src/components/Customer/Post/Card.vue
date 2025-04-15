<script setup lang="ts">
import type { Post } from '../../../models/Post';

// Props
const props = defineProps<{
  post: Post;
}>();

// Truncate text if too long
const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
</script>

<template>
  <div class="post-card">
    <div class="card-header">
      <h2 class="post-title">{{ post.title }}</h2>
      <!-- <div class="post-date" v-if="post.createdAt">
        {{ formatDate(post.createdAt) }}
      </div> -->
    </div>
    
    <div class="card-body">
      <p class="post-content">{{ truncateText(post.body) }}</p>
    </div>
    
    <div class="card-footer">
      <button class="read-more-button">
        Read More
      </button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.post-card
  background-color: #ffffff
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  overflow: hidden
  transition: all 0.3s ease
  display: flex
  flex-direction: column
  height: 100%

  &:hover
    transform: translateY(-3px)
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1)

.card-header
  padding: 1rem 1.5rem
  border-bottom: 1px solid #f1f1f1
  display: flex
  flex-direction: column
  gap: 0.5rem

.post-title
  font-size: 1.3rem
  font-weight: 600
  margin: 0
  color: #333
  line-height: 1.4

.post-date
  font-size: 0.85rem
  color: #888
  font-style: italic

.card-body
  padding: 1.5rem
  flex-grow: 1

.post-content
  margin: 0
  color: #666
  line-height: 1.6

.card-footer
  padding: 1rem 1.5rem
  border-top: 1px solid #f1f1f1
  display: flex
  justify-content: flex-end

.read-more-button
  padding: 0.5rem 1rem
  border-radius: 4px
  font-size: 0.9rem
  cursor: pointer
  border: none
  background-color: #4caf50
  color: white
  transition: background-color 0.3s

  &:hover
    background-color: #45a049
</style>