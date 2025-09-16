import { Injectable, signal } from '@angular/core';

export interface PaginationState {
  first: number;
  rows: number;
  page: number;
  totalRecords: number;
}

export interface PaginationEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private paginationState = signal<PaginationState>({
    first: 0,
    rows: 10,
    page: 1,
    totalRecords: 0,
  });

  /**
   * Get current pagination state
   */
  getPaginationState(): PaginationState {
    return this.paginationState();
  }

  /**
   * Update pagination state
   */
  updatePaginationState(state: Partial<PaginationState>): void {
    this.paginationState.update(current => ({ ...current, ...state }));
  }

  /**
   * Reset pagination to first page
   */
  resetPagination(): void {
    this.paginationState.set({
      first: 0,
      rows: 10,
      page: 1,
      totalRecords: 0,
    });
  }

  /**
   * Handle page change event from PrimeNG table
   */
  handlePageChange(event: PaginationEvent): PaginationState {
    const newState: PaginationState = {
      first: event.first,
      rows: event.rows,
      page: Math.floor(event.first / event.rows) + 1,
      totalRecords: this.paginationState().totalRecords,
    };
    
    this.updatePaginationState(newState);
    return newState;
  }

  /**
   * Set total records from API response
   */
  setTotalRecords(total: number): void {
    this.updatePaginationState({ totalRecords: total });
  }

  /**
   * Get API parameters for backend call
   * Based on FlexiblePageNumberPagination backend class
   */
  getApiParams(): { page: number; count: number } {
    const state = this.paginationState();
    return {
      page: state.page,
      count: state.rows,
    };
  }

  /**
   * Process API response to extract pagination data
   * Handles the response format from FlexiblePageNumberPagination
   */
  processApiResponse(response: any): { results: any[]; totalRecords: number } {
    return {
      results: response.results || [],
      totalRecords: response.count || 0,
    };
  }
}
