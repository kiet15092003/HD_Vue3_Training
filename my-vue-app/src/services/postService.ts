import type { PagedParams } from '../models/Common/PagedParams';
import type { PagedResult } from '../models/Common/PagedResult';
import type { Post, PostCreateRequest, PostUpdateRequest } from '../models/Post';
import { apiClient } from './http/apiClient';

export class PostService {
  private baseUrl = '/posts';

  /**
   * Get posts with pagination
   */
  async getPosts(params: PagedParams): Promise<PagedResult<Post>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await apiClient.get(this.baseUrl, { params });
      
      if (!response.data.success) {
        throw new Error(response.data.error);
      }
      
      return response.data.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch posts');
    }
  }

  /**
   * Get a single post by ID
   */
  async getPost(id: string): Promise<Post> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error);
      }
      
      return response.data.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch post');
    }
  }

  /**
   * Create a new post
   */
  async createPost(post: PostCreateRequest): Promise<Post> {
    try {
      const response = await apiClient.post(this.baseUrl, post);
      
      if (!response.data.success) {
        throw new Error(response.data.error);
      }
      
      return response.data.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create post');
    }
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, post: PostUpdateRequest): Promise<Post> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, post);
      
      if (!response.data.success) {
        throw new Error(response.data.error);
      }
      
      return response.data.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update post');
    }
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error);
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete post');
    }
  }
}

export const postService = new PostService();
