import { defineStore } from 'pinia';
import type { PagedParams } from '../models/Common/PagedParams';

// Extend PagedParams with date range filters
interface PostPagedParams extends PagedParams {
  startDate: string | null;
  endDate: string | null;
}

export const usePostStore = defineStore('post', {
  state: () => ({
    // UI state
    selectedPostId: null as string | null,
    showModal: false,
    modalMode: 'create' as 'create' | 'edit',
    
    // Search and filter params
    pagedParams: {
      page: 1,
      pageSize: 9,
      search: '',
      sort: 'createdAt',
      order: 'desc',
      startDate: null,
      endDate: null
    } as PostPagedParams
  }),
  
  getters: {
    getPagedParams: (state) => state.pagedParams
  },
  
  actions: {
    setSelectedPostId(id: string | null) {
      this.selectedPostId = id;
    },
    
    openCreateModal() {
      this.modalMode = 'create';
      this.selectedPostId = null;
      this.showModal = true;
    },
    
    openEditModal(id: string) {
      this.modalMode = 'edit';
      this.selectedPostId = id;
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
    },
    
    updatePagedParams(params: Partial<PostPagedParams>) {
      this.pagedParams = {
        ...this.pagedParams,
        ...params
      };
    },
    
    setPage(page: number) {
      this.pagedParams.page = page;
    },
    
    setSearch(search: string) {
      this.pagedParams.search = search;
      this.pagedParams.page = 1; // Reset to first page on new search
    },
    
    setDateRange(startDate: string | null, endDate: string | null) {
      this.pagedParams.startDate = startDate;
      this.pagedParams.endDate = endDate;
      this.pagedParams.page = 1; // Reset to first page on new date filter
    },
    
    clearDateRange() {
      this.pagedParams.startDate = null;
      this.pagedParams.endDate = null;
      this.pagedParams.page = 1; // Reset to first page when clearing filters
    }
  }
});
