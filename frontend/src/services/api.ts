import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchIncidents(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return {
      success: false,
      count: 0,
      data: [],
      error: 'Failed to fetch incidents',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

