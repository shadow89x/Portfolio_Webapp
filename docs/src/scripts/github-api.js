/**
 * GitHub API Integration
 * 
 * This module handles GitHub API integration for:
 * - User profile information
 * - Repository listing and filtering
 * - Language statistics
 * - Repository analytics
 * - Rate limiting and caching
 * 
 * Architecture:
 * - Class-based API client
 * - Caching for performance
 * - Error handling and retry logic
 * - Rate limit management
 * - Data transformation utilities
 */

// ========================================
// GitHub API Client Class
// ========================================

class GitHubAPIClient {
  constructor(options = {}) {
    this.baseURL = 'https://api.github.com';
    this.token = options.token || null;
    this.username = options.username || null;
    this.cache = new Map();
    this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes
    this.rateLimit = {
      remaining: 60,
      reset: Date.now() + 3600000, // 1 hour
      limit: 60
    };
    
    this.init();
  }
  
  /**
   * Initialize the API client
   */
  init() {
    // Load cached data from localStorage
    this.loadCache();
    
    // Check rate limit on initialization
    this.checkRateLimit();
  }
  
  /**
   * Make authenticated request to GitHub API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add authentication if token is available
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      // Update rate limit info
      this.updateRateLimit(response.headers);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('GitHub API request failed:', error);
      throw error;
    }
  }
  
  /**
   * Update rate limit information from response headers
   */
  updateRateLimit(headers) {
    this.rateLimit = {
      remaining: parseInt(headers.get('X-RateLimit-Remaining') || '60'),
      reset: parseInt(headers.get('X-RateLimit-Reset') || '0') * 1000,
      limit: parseInt(headers.get('X-RateLimit-Limit') || '60')
    };
  }
  
  /**
   * Check if we have remaining API calls
   */
  checkRateLimit() {
    const now = Date.now();
    
    if (now >= this.rateLimit.reset) {
      // Reset time has passed, reset the counter
      this.rateLimit.remaining = this.rateLimit.limit;
      this.rateLimit.reset = now + 3600000; // 1 hour from now
    }
    
    return this.rateLimit.remaining > 0;
  }
  
  /**
   * Get remaining API calls
   */
  getRemainingCalls() {
    return this.rateLimit.remaining;
  }
  
  /**
   * Get time until rate limit reset
   */
  getTimeUntilReset() {
    const now = Date.now();
    return Math.max(0, this.rateLimit.reset - now);
  }
  
  /**
   * Cache management
   */
  setCache(key, data) {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    
    this.cache.set(key, cacheItem);
    this.saveCache();
  }
  
  getCache(key) {
    const cacheItem = this.cache.get(key);
    
    if (!cacheItem) return null;
    
    const now = Date.now();
    if (now - cacheItem.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return cacheItem.data;
  }
  
  clearCache() {
    this.cache.clear();
    this.saveCache();
  }
  
  saveCache() {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem('github-api-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }
  
  loadCache() {
    try {
      const cacheData = localStorage.getItem('github-api-cache');
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        this.cache = new Map(parsed);
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      this.cache = new Map();
    }
  }
  
  /**
   * Get user profile information
   */
  async getUserProfile(username) {
    const cacheKey = `user-${username}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    const data = await this.request(`/users/${username}`);
    this.setCache(cacheKey, data);
    
    return data;
  }
  
  /**
   * Get user repositories
   */
  async getUserRepositories(username, options = {}) {
    const {
      type = 'all',
      sort = 'updated',
      direction = 'desc',
      per_page = 100,
      page = 1
    } = options;
    
    const cacheKey = `repos-${username}-${type}-${sort}-${direction}-${per_page}-${page}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    const params = new URLSearchParams({
      type,
      sort,
      direction,
      per_page: per_page.toString(),
      page: page.toString()
    });
    
    const data = await this.request(`/users/${username}/repos?${params}`);
    this.setCache(cacheKey, data);
    
    return data;
  }
  
  /**
   * Get repository details
   */
  async getRepository(owner, repo) {
    const cacheKey = `repo-${owner}-${repo}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    const data = await this.request(`/repos/${owner}/${repo}`);
    this.setCache(cacheKey, data);
    
    return data;
  }
  
  /**
   * Get repository languages
   */
  async getRepositoryLanguages(owner, repo) {
    const cacheKey = `languages-${owner}-${repo}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    const data = await this.request(`/repos/${owner}/${repo}/languages`);
    this.setCache(cacheKey, data);
    
    return data;
  }
  
  /**
   * Get repository contributors
   */
  async getRepositoryContributors(owner, repo) {
    const cacheKey = `contributors-${owner}-${repo}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    const data = await this.request(`/repos/${owner}/${repo}/contributors`);
    this.setCache(cacheKey, data);
    
    return data;
  }
  
  /**
   * Get repository readme
   */
  async getRepositoryReadme(owner, repo) {
    const cacheKey = `readme-${owner}-${repo}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    try {
      const data = await this.request(`/repos/${owner}/${repo}/readme`);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      // README might not exist
      return null;
    }
  }
  
  /**
   * Search repositories
   */
  async searchRepositories(query, options = {}) {
    const {
      sort = 'stars',
      order = 'desc',
      per_page = 30,
      page = 1
    } = options;
    
    const cacheKey = `search-${query}-${sort}-${order}-${per_page}-${page}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    const params = new URLSearchParams({
      q: query,
      sort,
      order,
      per_page: per_page.toString(),
      page: page.toString()
    });
    
    const data = await this.request(`/search/repositories?${params}`);
    this.setCache(cacheKey, data);
    
    return data;
  }
  
  /**
   * Get trending repositories
   */
  async getTrendingRepositories(timeframe = 'daily', language = null) {
    const cacheKey = `trending-${timeframe}-${language || 'all'}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    // Note: GitHub API doesn't have a trending endpoint
    // This would typically use a different service or web scraping
    // For now, we'll return a mock response
    const mockData = {
      items: [
        {
          id: 1,
          name: 'example-repo',
          full_name: 'username/example-repo',
          description: 'An example trending repository',
          stargazers_count: 1000,
          language: 'JavaScript',
          html_url: 'https://github.com/username/example-repo'
        }
      ]
    };
    
    this.setCache(cacheKey, mockData);
    return mockData;
  }
}

// ========================================
// GitHub Data Transformer Class
// ========================================

class GitHubDataTransformer {
  /**
   * Transform repository data to portfolio format
   */
  static transformRepository(repo) {
    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      openIssues: repo.open_issues_count,
      size: repo.size,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      topics: repo.topics || [],
      isFork: repo.fork,
      isArchived: repo.archived,
      isPrivate: repo.private,
      hasIssues: repo.has_issues,
      hasWiki: repo.has_wiki,
      hasPages: repo.has_pages,
      hasDownloads: repo.has_downloads,
      license: repo.license?.name || null,
      defaultBranch: repo.default_branch,
      visibility: repo.visibility || (repo.private ? 'private' : 'public')
    };
  }
  
  /**
   * Transform user profile data
   */
  static transformUserProfile(user) {
    return {
      id: user.id,
      username: user.login,
      name: user.name,
      email: user.email,
      bio: user.bio,
      company: user.company,
      blog: user.blog,
      location: user.location,
      hireable: user.hireable,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      avatarUrl: user.avatar_url,
      gravatarId: user.gravatar_id,
      type: user.type,
      siteAdmin: user.site_admin,
      twitterUsername: user.twitter_username
    };
  }
  
  /**
   * Transform language statistics
   */
  static transformLanguages(languages) {
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    
    return Object.entries(languages).map(([language, bytes]) => ({
      language,
      bytes,
      percentage: ((bytes / total) * 100).toFixed(1)
    })).sort((a, b) => b.bytes - a.bytes);
  }
  
  /**
   * Transform contributor data
   */
  static transformContributors(contributors) {
    return contributors.map(contributor => ({
      id: contributor.id,
      username: contributor.login,
      avatarUrl: contributor.avatar_url,
      contributions: contributor.contributions,
      type: contributor.type,
      siteAdmin: contributor.site_admin
    }));
  }
  
  /**
   * Filter repositories by criteria
   */
  static filterRepositories(repositories, filters = {}) {
    let filtered = [...repositories];
    
    // Filter by language
    if (filters.language) {
      filtered = filtered.filter(repo => 
        repo.language && repo.language.toLowerCase() === filters.language.toLowerCase()
      );
    }
    
    // Filter by topic
    if (filters.topic) {
      filtered = filtered.filter(repo => 
        repo.topics && repo.topics.some(topic => 
          topic.toLowerCase().includes(filters.topic.toLowerCase())
        )
      );
    }
    
    // Filter by visibility
    if (filters.visibility) {
      filtered = filtered.filter(repo => repo.visibility === filters.visibility);
    }
    
    // Filter by fork status
    if (filters.forks !== undefined) {
      filtered = filtered.filter(repo => repo.isFork === filters.forks);
    }
    
    // Filter by archived status
    if (filters.archived !== undefined) {
      filtered = filtered.filter(repo => repo.isArchived === filters.archived);
    }
    
    // Filter by minimum stars
    if (filters.minStars) {
      filtered = filtered.filter(repo => repo.stars >= filters.minStars);
    }
    
    // Filter by minimum forks
    if (filters.minForks) {
      filtered = filtered.filter(repo => repo.forks >= filters.minForks);
    }
    
    return filtered;
  }
  
  /**
   * Sort repositories by criteria
   */
  static sortRepositories(repositories, sortBy = 'updated') {
    const sorted = [...repositories];
    
    switch (sortBy) {
      case 'stars':
        return sorted.sort((a, b) => b.stars - a.stars);
      case 'forks':
        return sorted.sort((a, b) => b.forks - a.forks);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'created':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'updated':
      default:
        return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
  }
  
  /**
   * Get repository statistics
   */
  static getRepositoryStats(repositories) {
    const stats = {
      total: repositories.length,
      languages: {},
      topics: {},
      totalStars: 0,
      totalForks: 0,
      totalSize: 0,
      public: 0,
      private: 0,
      forks: 0,
      archived: 0
    };
    
    repositories.forEach(repo => {
      // Language stats
      if (repo.language) {
        stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
      }
      
      // Topic stats
      if (repo.topics) {
        repo.topics.forEach(topic => {
          stats.topics[topic] = (stats.topics[topic] || 0) + 1;
        });
      }
      
      // Count stats
      stats.totalStars += repo.stars;
      stats.totalForks += repo.forks;
      stats.totalSize += repo.size;
      
      if (repo.visibility === 'public') stats.public++;
      if (repo.visibility === 'private') stats.private++;
      if (repo.isFork) stats.forks++;
      if (repo.isArchived) stats.archived++;
    });
    
    return stats;
  }
}

// ========================================
// GitHub Integration Manager Class
// ========================================

class GitHubIntegrationManager {
  constructor(options = {}) {
    this.apiClient = new GitHubAPIClient(options);
    this.username = options.username;
    this.repositories = [];
    this.userProfile = null;
    this.isLoading = false;
    this.error = null;
    
    this.init();
  }
  
  /**
   * Initialize the integration manager
   */
  init() {
    if (this.username) {
      this.loadUserData();
    }
  }
  
  /**
   * Load user data from GitHub
   */
  async loadUserData() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      // Load user profile and repositories in parallel
      const [profile, repositories] = await Promise.all([
        this.apiClient.getUserProfile(this.username),
        this.apiClient.getUserRepositories(this.username, { per_page: 100 })
      ]);
      
      this.userProfile = GitHubDataTransformer.transformUserProfile(profile);
      this.repositories = repositories.map(repo => 
        GitHubDataTransformer.transformRepository(repo)
      );
      
      // Trigger update event
      this.triggerUpdate();
      
    } catch (error) {
      console.error('Failed to load GitHub data:', error);
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }
  
  /**
   * Get filtered and sorted repositories
   */
  getRepositories(filters = {}, sortBy = 'updated') {
    let filtered = GitHubDataTransformer.filterRepositories(this.repositories, filters);
    return GitHubDataTransformer.sortRepositories(filtered, sortBy);
  }
  
  /**
   * Get repository statistics
   */
  getStats() {
    return GitHubDataTransformer.getRepositoryStats(this.repositories);
  }
  
  /**
   * Get language statistics
   */
  getLanguageStats() {
    const stats = this.getStats();
    return Object.entries(stats.languages)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Get topic statistics
   */
  getTopicStats() {
    const stats = this.getStats();
    return Object.entries(stats.topics)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Refresh data from GitHub
   */
  async refresh() {
    this.apiClient.clearCache();
    await this.loadUserData();
  }
  
  /**
   * Trigger update event
   */
  triggerUpdate() {
    const event = new CustomEvent('github-data-updated', {
      detail: {
        profile: this.userProfile,
        repositories: this.repositories,
        stats: this.getStats()
      }
    });
    
    document.dispatchEvent(event);
  }
  
  /**
   * Get API rate limit info
   */
  getRateLimitInfo() {
    return {
      remaining: this.apiClient.getRemainingCalls(),
      reset: this.apiClient.getTimeUntilReset(),
      limit: this.apiClient.rateLimit.limit
    };
  }
}

// ========================================
// Export Classes
// ========================================

// Make classes available globally
window.GitHubAPIClient = GitHubAPIClient;
window.GitHubDataTransformer = GitHubDataTransformer;
window.GitHubIntegrationManager = GitHubIntegrationManager;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GitHubAPIClient,
    GitHubDataTransformer,
    GitHubIntegrationManager
  };
} 