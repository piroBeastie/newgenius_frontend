// Get base URL from environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    // Ensure API_BASE_URL ends without a trailing slash before adding /api
    this.baseURL = `${API_BASE_URL.replace(/\/$/, '')}/api`;
    console.log(`API service initialized with base URL: ${this.baseURL}`);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Enhanced headers for CORS
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
        ...options.headers,
      },
      credentials: 'include', // Important for CORS with credentials
      mode: 'cors',          // Explicitly request CORS mode
      ...options,
    };

    try {
      console.log(`Making ${config.method || 'GET'} request to:`, url);
      
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Response data:', result);
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get user categories (following pages)
  async getUserCategories(userId) {
    return this.request(`/user/${userId}/categories`);
  }

  // Create new category (add following page)
  async createCategory(userId, prompt) {
    return this.request(`/user/${userId}/categories`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  // Get news for a category
  async getCategoryNews(userId, categoryId) {
    return this.request(`/user/${userId}/categories/${categoryId}/news`);
  }

  // Refresh news for a category
  async refreshCategoryNews(userId, categoryId) {
    return this.request(`/user/${userId}/categories/${categoryId}/refresh_news`, {
      method: 'POST',
    });
  }

  // Delete category - Enhanced with better error handling
  async deleteCategory(userId, categoryId) {
    console.log('API - Deleting category:', userId, categoryId);
    
    try {
      const result = await this.request(`/user/${userId}/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      console.log('Delete successful:', result);
      return result;
    } catch (error) {
      console.error('Delete category API error:', error);
      throw error;
    }
  }
}

export default new ApiService();
