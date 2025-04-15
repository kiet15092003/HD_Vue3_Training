import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostService } from '../../../services/postService';
import { apiClient } from '../../../services/http/apiClient';
import type { Post, PostCreateRequest, PostUpdateRequest } from '../../../models/Post';
import type { PagedParams } from '../../../models/Common/PagedParams';
import type { PagedResult } from '../../../models/Common/PagedResult';

// Mock the apiClient
vi.mock('../../../services/http/apiClient', () => {
  return {
    apiClient: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(), 
      delete: vi.fn()
    }
  };
});

describe('PostService', () => {
  let postService: PostService;
  const mockPost: Post = {
    id: '1',
    title: 'Test Post',
    body: 'This is a test post',
    createdAt: '2023-01-01T00:00:00.000Z'
  };
  
  const mockCreateRequest: PostCreateRequest = {
    title: 'New Post',
    body: 'This is a new post'
  };
  
  const mockUpdateRequest: PostUpdateRequest = {
    title: 'Updated Post',
    body: 'This post has been updated'
  };
  
  const mockPagedParams: PagedParams = {
    page: 1,
    pageSize: 10,
    search: '',
  };
  
  const mockPagedResult: PagedResult<Post> = {
    items: [mockPost],
    pageSize: 10,
    pageNumber: 1,
    totalCount: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };

  beforeEach(() => {
    postService = new PostService();
    vi.resetAllMocks();
  });

  describe('getPosts', () => {
    it('should fetch posts with pagination successfully', async () => {
      // Mock successful response
      (apiClient.get as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: mockPagedResult,
          error: []
        }
      });

      const result = await postService.getPosts(mockPagedParams);

      expect(apiClient.get).toHaveBeenCalledWith('/posts', { params: mockPagedParams });
      expect(result).toEqual(mockPagedResult);
    });

    it('should handle API error in getPosts', async () => {
      // Mock error response
      (apiClient.get as any).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
          error: 'Failed to fetch posts'
        }
      });

      await expect(postService.getPosts(mockPagedParams)).rejects.toThrow('Failed to fetch posts');
    });

    it('should handle network error in getPosts', async () => {
      // Mock network error
      (apiClient.get as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(postService.getPosts(mockPagedParams)).rejects.toThrow('Network error');
    });
  });

  describe('getPost', () => {
    it('should fetch a single post successfully', async () => {
      // Mock successful response
      (apiClient.get as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: mockPost,
          error: []
        }
      });

      const result = await postService.getPost('1');

      expect(apiClient.get).toHaveBeenCalledWith('/posts/1');
      expect(result).toEqual(mockPost);
    });

    it('should handle API error in getPost', async () => {
      // Mock error response
      (apiClient.get as any).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
          error: 'Post not found'
        }
      });

      await expect(postService.getPost('1')).rejects.toThrow('Post not found');
    });
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      // Mock successful response
      (apiClient.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: mockPost,
          error: []
        }
      });

      const result = await postService.createPost(mockCreateRequest);

      expect(apiClient.post).toHaveBeenCalledWith('/posts', mockCreateRequest);
      expect(result).toEqual(mockPost);
    });

    it('should handle API error in createPost', async () => {
      // Mock error response
      (apiClient.post as any).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
          error: 'Failed to create post'
        }
      });

      await expect(postService.createPost(mockCreateRequest)).rejects.toThrow('Failed to create post');
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const updatedPost = { ...mockPost, title: 'Updated Post', body: 'This post has been updated' };
      
      // Mock successful response
      (apiClient.put as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: updatedPost,
          error: []
        }
      });

      const result = await postService.updatePost('1', mockUpdateRequest);

      expect(apiClient.put).toHaveBeenCalledWith('/posts/1', mockUpdateRequest);
      expect(result).toEqual(updatedPost);
    });

    it('should handle API error in updatePost', async () => {
      // Mock error response
      (apiClient.put as any).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
          error: 'Failed to update post'
        }
      });

      await expect(postService.updatePost('1', mockUpdateRequest)).rejects.toThrow('Failed to update post');
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // Mock successful response
      (apiClient.delete as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: null,
          error: []
        }
      });

      await postService.deletePost('1');

      expect(apiClient.delete).toHaveBeenCalledWith('/posts/1');
    });

    it('should handle API error in deletePost', async () => {
      // Mock error response
      (apiClient.delete as any).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
          error: 'Failed to delete post'
        }
      });

      await expect(postService.deletePost('1')).rejects.toThrow('Failed to delete post');
    });
  });
});