<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { usePostStore } from '../../../stores/PostStore';
import { postService } from '../../../services/postService';
import type { Post } from '../../../models/Post';

// Props
const props = defineProps<{
  post: Post;
}>();

const postStore = usePostStore();
const queryClient = useQueryClient();

// Handle edit post
const handleEditClick = () => {
  postStore.openEditModal(props.post.id);
};

// Delete post mutation
const deleteMutation = useMutation({
  mutationFn: (id: string) => postService.deletePost(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }
});

// Confirm and delete post
const handleDeleteClick = () => {
  if (confirm(`Are you sure you want to delete "${props.post.title}"?`)) {
    deleteMutation.mutate(props.post.id);
  }
};

// Truncate text if too long
const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format the date for display
const formatDate = (dateString: string): string => {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="post-card" :class="{ 'deleting': deleteMutation.isPending.value }">
    <div class="card-header">
      <h2 class="post-title">{{ post.title }}</h2>
      <div class="post-date">Created: {{ formatDate(post.createdAt) }}</div>
    </div>
    
    <div class="card-body">
      <p class="post-content">{{ truncateText(post.body) }}</p>
    </div>
    
    <div class="card-footer">
      <button 
        class="action-button edit-button" 
        @click="handleEditClick"
        :disabled="deleteMutation.isPending.value"
      >
        Edit
      </button>
      
      <button 
        class="action-button delete-button" 
        @click="handleDeleteClick"
        :disabled="deleteMutation.isPending.value"
      >
        {{ deleteMutation.isPending.value ? 'Deleting...' : 'Delete' }}
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

  &.deleting
    opacity: 0.6
    pointer-events: none

.card-header
  padding: 1rem 1.5rem
  border-bottom: 1px solid #f1f1f1

.post-title
  font-size: 1.3rem
  font-weight: 600
  margin: 0
  color: #333
  line-height: 1.4

.post-date
  font-size: 0.85rem
  color: #777
  margin-top: 0.4rem
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
  gap: 0.8rem

.action-button
  padding: 0.5rem 1rem
  border-radius: 4px
  font-size: 0.9rem
  cursor: pointer
  border: none
  transition: background-color 0.3s

  &:disabled
    opacity: 0.7
    cursor: not-allowed

.edit-button
  background-color: #2196F3
  color: white

  &:hover
    background-color: #0b7dda

.delete-button
  background-color: #f44336
  color: white

  &:hover
    background-color: #d32f2f
</style>
