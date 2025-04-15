<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query';
import { usePostStore } from '../../../stores/PostStore';
import { postService } from '../../../services/postService';
import type { PostCreateRequest, PostUpdateRequest } from '../../../models/Post';
// Add Vuelidate imports
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

const postStore = usePostStore();
const queryClient = useQueryClient();

const title = ref('');
const body = ref('');
const formError = ref('');

// Add validation rules
const rules = {
  title: { 
    required, 
    minLength: minLength(5) 
  },
  body: { 
    required, 
    minLength: minLength(5) 
  }
};

// Create Vuelidate instance
const v$ = useVuelidate(rules, { title, body });

// Computed for modal visibility and mode
const isOpen = computed(() => postStore.showModal);
const isEditMode = computed(() => postStore.modalMode === 'edit');
const modalTitle = computed(() => isEditMode.value ? 'Edit Post' : 'Create New Post');

// If editing, fetch the post data
const { data: postData } = useQuery({
  queryKey: ['post', postStore.selectedPostId],
  queryFn: () => postStore.selectedPostId ? postService.getPost(postStore.selectedPostId) : null,
  enabled: computed(() => !!postStore.selectedPostId && isEditMode.value),
});

// Watch for post data changes and update form
watch(postData, (newVal) => {
  if (newVal) {
    title.value = newVal.title;
    body.value = newVal.body;
    v$.value.$reset(); // Reset validation state when loading data
  }
});

// Clear form when modal is closed
watch(isOpen, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

// Create post mutation
const createMutation = useMutation({
  mutationFn: (post: PostCreateRequest) => postService.createPost(post),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    postStore.closeModal();
    resetForm();
  },
  onError: (error: any) => {
    formError.value = error.message || 'Failed to create post';
  }
});

// Update post mutation
const updateMutation = useMutation({
  mutationFn: ({ id, post }: { id: string, post: PostUpdateRequest }) => 
    postService.updatePost(id, post),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    queryClient.invalidateQueries({ queryKey: ['post', postStore.selectedPostId] });
    postStore.closeModal();
    resetForm();
  },
  onError: (error: any) => {
    formError.value = error.message || 'Failed to update post';
  }
});

// Combined submitting state
const isSubmitting = computed(() => 
  createMutation.isPending.value || updateMutation.isPending.value
);

// Form submission with validation
const handleSubmit = async () => {
  // Validate form
  const isFormValid = await v$.value.$validate();
  
  if (!isFormValid) {
    formError.value = 'Please correct the form errors';
    return;
  }
  
  formError.value = '';
  
  if (isEditMode.value && postStore.selectedPostId) {
    updateMutation.mutate({
      id: postStore.selectedPostId,
      post: {
        title: title.value.trim(),
        body: body.value.trim()
      }
    });
  } else {
    createMutation.mutate({
      title: title.value.trim(),
      body: body.value.trim()
    });
  }
};

const resetForm = () => {
  title.value = '';
  body.value = '';
  formError.value = '';
  v$.value.$reset(); // Reset validation
};

const closeModal = () => {
  postStore.closeModal();
};
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>{{ modalTitle }}</h2>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div v-if="formError" class="error-message">
              {{ formError }}
            </div>
            
            <div class="form-group">
              <label for="post-title">Title</label>
              <input
                id="post-title"
                v-model="title"
                v-focus.delay
                type="text"
                placeholder="Post title"
                :disabled="isSubmitting"
                class="form-control"
                :class="{ 'is-invalid': v$.title.$error }"
                @blur="v$.title.$touch()"
              />
              <div v-if="v$.title.$error" class="validation-error">
                <span v-if="v$.title.required.$invalid">Title is required</span>
                <span v-else-if="v$.title.minLength.$invalid">Title must be at least 5 characters</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="post-body">Content</label>
              <textarea
                id="post-body"
                v-model="body"
                placeholder="Post content"
                :disabled="isSubmitting"
                class="form-control"
                :class="{ 'is-invalid': v$.body.$error }"
                rows="6"
                @blur="v$.body.$touch()"
              ></textarea>
              <div v-if="v$.body.$error" class="validation-error">
                <span v-if="v$.body.required.$invalid">Content is required</span>
                <span v-else-if="v$.body.minLength.$invalid">Content must be at least 5 characters</span>
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="button" 
                class="cancel-button" 
                @click="closeModal"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                class="submit-button"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="sass" scoped>
// Variables
$primary-color: #4caf50
$danger-color: #f44336
$light-gray: #f1f1f1
$border-gray: #e0e0e0
$dark-text: #333333
$modal-width: 500px // Changed to fixed 400px width
$input-radius: 6px
$box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2)
$transition-speed: 0.3s
$modal-padding: 20px // Consistent padding value

// Mixins
@mixin button-style($bg-color, $text-color)
  padding: 0.7rem 1.2rem
  background-color: $bg-color
  color: $text-color
  border: none
  border-radius: $input-radius
  font-size: 1rem
  font-weight: 500
  cursor: pointer
  transition: all $transition-speed ease
  
  &:hover:not(:disabled)
    transform: translateY(-2px)
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2)
    background-color: darken($bg-color, 5%)
  
  &:active:not(:disabled)
    transform: translateY(0)
  
  &:disabled
    opacity: 0.6
    cursor: not-allowed

// Modal styles
.modal-overlay
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: rgba(0, 0, 0, 0.6)
  display: flex
  justify-content: center
  align-items: center
  z-index: 1000
  animation: fadeIn $transition-speed ease

.modal-container
  background-color: white
  border-radius: 12px
  box-shadow: $box-shadow
  width: $modal-width // Fixed width of 400px
  max-height: 90vh
  display: flex
  flex-direction: column
  animation: slideIn $transition-speed ease
  overflow: hidden

.modal-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: $modal-padding // Consistent 20px padding
  border-bottom: 1px solid $border-gray
  background-color: #fcfcfc
  
  h2
    margin: 0
    font-size: 1.6rem
    color: $dark-text
    font-weight: 600

.close-button
  background-color: $danger-color // Red background
  border: none
  font-size: 1.2rem // Smaller font size for the X
  cursor: pointer
  color: white
  width: 30px // Changed to 20px
  height: 30px // Changed to 20px
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50%
  padding: 0 // Remove any padding that might affect the shape
  line-height: 1 // Ensure proper vertical alignment of the X
  // No hover effect needed

.modal-body
  padding: $modal-padding // Consistent 20px padding
  overflow-y: auto

.form-group
  margin-bottom: 1.5rem
  
  label
    display: block
    margin-bottom: 0.6rem
    font-weight: 500
    color: $dark-text
    font-size: 1rem

.form-control
  width: 93%
  padding: 0.8rem 1rem
  border: 1px solid $border-gray
  border-radius: $input-radius
  font-size: 1rem
  transition: border-color $transition-speed ease, box-shadow $transition-speed ease
  
  &:focus
    outline: none
    border-color: lighten($primary-color, 20%)
    box-shadow: 0 0 0 3px rgba($primary-color, 0.1)
  
  &.is-invalid
    border-color: $danger-color
    box-shadow: 0 0 0 3px rgba($danger-color, 0.1)

textarea.form-control
  resize: vertical
  min-height: 120px

.form-actions
  display: flex
  justify-content: flex-end
  gap: 0.8rem
  margin-top: 1.5rem

.cancel-button
  @include button-style($light-gray, $dark-text)

.submit-button
  @include button-style($primary-color, white)

.error-message
  background-color: lighten($danger-color, 35%)
  color: $danger-color
  padding: 0.8rem 1rem
  border-radius: $input-radius
  margin-bottom: 1.5rem
  font-weight: 500
  display: flex
  align-items: center

  &:before
    content: "!"
    display: inline-flex
    justify-content: center
    align-items: center
    width: 22px
    height: 22px
    background-color: $danger-color
    color: white
    border-radius: 50%
    margin-right: 0.5rem
    font-weight: bold

.validation-error
  color: $danger-color
  font-size: 0.85rem
  margin-top: 0.4rem
  display: block
  
  span
    display: block
    padding: 0.3rem 0

// Animations
@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1

@keyframes slideIn
  from
    opacity: 0
    transform: translateY(-20px)
  to
    opacity: 1
    transform: translateY(0)

// Responsive adjustments
@media (max-width: 576px)
  .modal-container
    width: 95%
    max-height: 95vh
  
  .modal-header
    padding: $modal-padding // Consistent 20px padding
    
    h2
      font-size: 1.4rem
  
  .modal-body
    padding: $modal-padding // Consistent 20px padding
  
  .form-actions
    flex-direction: column-reverse
    
    button
      width: 100%
</style>