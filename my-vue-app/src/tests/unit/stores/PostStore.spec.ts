import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePostStore } from '../../../stores/PostStore';

describe('PostStore', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    it('should have the correct initial state', () => {
      const store = usePostStore();
      
      expect(store.selectedPostId).toBeNull();
      expect(store.showModal).toBe(false);
      expect(store.modalMode).toBe('create');
      expect(store.pagedParams).toEqual({
        page: 1,
        pageSize: 9,
        search: '',
        sort: 'createdAt',
        order: 'desc',
        startDate: null,
        endDate: null
      });
    });
  });

  describe('actions', () => {
    it('should set the selected post ID', () => {
      const store = usePostStore();
      store.setSelectedPostId('123');
      
      expect(store.selectedPostId).toBe('123');
    });

    it('should open the create modal', () => {
      const store = usePostStore();
      
      // First, set some values to ensure they get reset
      store.selectedPostId = '123';
      store.modalMode = 'edit';
      store.showModal = false;
      
      // Call the action
      store.openCreateModal();
      
      // Verify state changes
      expect(store.modalMode).toBe('create');
      expect(store.selectedPostId).toBeNull();
      expect(store.showModal).toBe(true);
    });

    it('should open the edit modal', () => {
      const store = usePostStore();
      
      // Set initial values
      store.selectedPostId = null;
      store.modalMode = 'create';
      store.showModal = false;
      
      // Call the action
      store.openEditModal('456');
      
      // Verify state changes
      expect(store.modalMode).toBe('edit');
      expect(store.selectedPostId).toBe('456');
      expect(store.showModal).toBe(true);
    });

    it('should close the modal', () => {
      const store = usePostStore();
      
      // Set initial value
      store.showModal = true;
      
      // Call the action
      store.closeModal();
      
      // Verify state change
      expect(store.showModal).toBe(false);
    });

    it('should update paged params', () => {
      const store = usePostStore();
      
      // Call the action
      store.updatePagedParams({ 
        page: 2, 
        pageSize: 20,
        search: 'test search'
      });
      
      // Verify state changes
      expect(store.pagedParams.page).toBe(2);
      expect(store.pagedParams.pageSize).toBe(20);
      expect(store.pagedParams.search).toBe('test search');
      
      // Verify other params remain unchanged
      expect(store.pagedParams.startDate).toBeNull();
      expect(store.pagedParams.endDate).toBeNull();
    });

    it('should set the page', () => {
      const store = usePostStore();
      
      // Call the action
      store.setPage(3);
      
      // Verify state change
      expect(store.pagedParams.page).toBe(3);
    });

    it('should set the search term and reset to page 1', () => {
      const store = usePostStore();
      
      // Set initial page to something other than 1
      store.pagedParams.page = 5;
      
      // Call the action
      store.setSearch('new search term');
      
      // Verify state changes
      expect(store.pagedParams.search).toBe('new search term');
      expect(store.pagedParams.page).toBe(1); // Should reset to page 1
    });

    it('should set date range and reset to page 1', () => {
      const store = usePostStore();
      
      // Set initial page to something other than 1
      store.pagedParams.page = 5;
      
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      
      // Call the action
      store.setDateRange(startDate, endDate);
      
      // Verify state changes
      expect(store.pagedParams.startDate).toBe(startDate);
      expect(store.pagedParams.endDate).toBe(endDate);
      expect(store.pagedParams.page).toBe(1); // Should reset to page 1
    });

    it('should clear date range and reset to page 1', () => {
      const store = usePostStore();
      
      // Set initial values
      store.pagedParams.page = 5;
      store.pagedParams.startDate = '2023-01-01';
      store.pagedParams.endDate = '2023-01-31';
      
      // Call the action
      store.clearDateRange();
      
      // Verify state changes
      expect(store.pagedParams.startDate).toBeNull();
      expect(store.pagedParams.endDate).toBeNull();
      expect(store.pagedParams.page).toBe(1); // Should reset to page 1
    });
  });

  describe('getters', () => {
    it('should get the paged params', () => {
      const store = usePostStore();
      const customParams = {
        page: 3,
        pageSize: 15,
        search: 'custom search',
        sort: 'title',
        order: 'asc',
        startDate: '2023-02-01',
        endDate: '2023-02-28'
      };
      
      // Update store state
      store.pagedParams = { ...customParams };
      
      // Test the getter
      expect(store.getPagedParams).toEqual(customParams);
    });
  });
});