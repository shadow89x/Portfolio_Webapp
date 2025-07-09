/**
 * Portfolio Page JavaScript
 * 
 * This module handles all portfolio page functionality including:
 * - Project data loading and display
 * - Search and filtering
 * - Sorting and pagination
 * - Modal interactions
 * - GitHub API integration
 * - Performance optimization
 * 
 * Architecture:
 * - Class-based organization
 * - Event-driven interactions
 * - Modular functionality
 * - Error handling
 * - Accessibility support
 */

// ========================================
// Portfolio Manager Class
// ========================================

class PortfolioManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilters = {
      search: '',
      category: '',
      sort: 'date-desc'
    };
    this.isLoading = false;
    this.currentPage = 1;
    this.projectsPerPage = 12;
    
    // DOM elements
    this.elements = {
      searchInput: document.getElementById('project-search'),
      categoryFilter: document.getElementById('category-filter'),
      sortSelect: document.getElementById('sort-select'),
      projectsGrid: document.getElementById('projects-grid'),
      projectsLoading: document.getElementById('projects-loading'),
      projectsEmpty: document.getElementById('projects-empty'),
      projectsCount: document.getElementById('projects-count'),
      visibleCount: document.getElementById('visible-count'),
      totalCount: document.getElementById('total-count'),
      activeFilters: document.getElementById('active-filters'),
      modal: document.getElementById('project-modal'),
      modalBackdrop: document.getElementById('modal-backdrop'),
      modalClose: document.getElementById('modal-close'),
      modalTitle: document.getElementById('modal-title'),
      modalContent: document.getElementById('modal-content'),
      githubConnect: document.getElementById('github-connect')
    };
    
    this.init();
  }
  
  /**
   * Initialize the portfolio manager
   */
  init() {
    this.bindEvents();
    this.loadProjects();
    this.updateTooltips();
  }
  
  /**
   * Bind event listeners
   */
  bindEvents() {
    // Search functionality
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
    }
    
    // Filter functionality
    if (this.elements.categoryFilter) {
      this.elements.categoryFilter.addEventListener('change', this.handleCategoryFilter.bind(this));
    }
    
    // Sort functionality
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener('change', this.handleSort.bind(this));
    }
    
    // Modal functionality
    if (this.elements.modalBackdrop) {
      this.elements.modalBackdrop.addEventListener('click', this.closeModal.bind(this));
    }
    
    if (this.elements.modalClose) {
      this.elements.modalClose.addEventListener('click', this.closeModal.bind(this));
    }
    
    // GitHub integration
    if (this.elements.githubConnect) {
      this.elements.githubConnect.addEventListener('click', this.handleGitHubConnect.bind(this));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
    
    // Intersection Observer for lazy loading
    this.setupIntersectionObserver();
  }
  
  /**
   * Load projects data
   */
  async loadProjects() {
    try {
      this.setLoading(true);
      
      // Simulate API call with sample data
      const projects = await this.fetchProjects();
      this.projects = projects;
      this.filteredProjects = [...this.projects];
      
      this.renderProjects();
      this.updateCounts();
      
    } catch (error) {
      console.error('Error loading projects:', error);
      this.showError('Failed to load projects. Please try again later.');
    } finally {
      this.setLoading(false);
    }
  }
  
  /**
   * Fetch projects from API or local data
   */
  async fetchProjects() {
    // For demo purposes, return sample data
    // In production, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getSampleProjects());
      }, 1000);
    });
  }
  
  /**
   * Get sample project data
   */
  getSampleProjects() {
    return [
      {
        id: 1,
        name: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.',
        image: '/images/projects/ecommerce.jpg',
        category: 'web-development',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        githubUrl: 'https://github.com/username/ecommerce-platform',
        liveUrl: 'https://ecommerce-demo.com',
        stars: 45,
        forks: 12,
        language: 'JavaScript',
        status: 'live',
        createdAt: '2024-01-15',
        updatedAt: '2024-03-20'
      },
      {
        id: 2,
        name: 'Data Analytics Dashboard',
        description: 'Interactive dashboard for data visualization and analytics using PowerBI and SQL Server. Provides real-time insights and customizable reports.',
        image: '/images/projects/dashboard.jpg',
        category: 'data-analysis',
        technologies: ['PowerBI', 'SQL Server', 'Python', 'Azure'],
        githubUrl: 'https://github.com/username/analytics-dashboard',
        liveUrl: 'https://analytics-demo.com',
        stars: 32,
        forks: 8,
        language: 'Python',
        status: 'development',
        createdAt: '2024-02-10',
        updatedAt: '2024-03-15'
      },
      {
        id: 3,
        name: 'Machine Learning Model',
        description: 'Predictive analytics model for customer behavior analysis using scikit-learn and TensorFlow. Achieves 94% accuracy on test data.',
        image: '/images/projects/ml-model.jpg',
        category: 'machine-learning',
        technologies: ['Python', 'scikit-learn', 'TensorFlow', 'Pandas'],
        githubUrl: 'https://github.com/username/ml-predictor',
        liveUrl: null,
        stars: 28,
        forks: 15,
        language: 'Python',
        status: 'development',
        createdAt: '2024-01-20',
        updatedAt: '2024-03-10'
      },
      {
        id: 4,
        name: 'Mobile App',
        description: 'Cross-platform mobile application for task management built with React Native. Features offline support and real-time synchronization.',
        image: '/images/projects/mobile-app.jpg',
        category: 'mobile-app',
        technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
        githubUrl: 'https://github.com/username/task-manager-app',
        liveUrl: 'https://apps.apple.com/app/task-manager',
        stars: 67,
        forks: 23,
        language: 'TypeScript',
        status: 'live',
        createdAt: '2023-12-05',
        updatedAt: '2024-03-18'
      },
      {
        id: 5,
        name: 'REST API Service',
        description: 'Scalable REST API service with authentication, rate limiting, and comprehensive documentation. Built with Express.js and PostgreSQL.',
        image: '/images/projects/api-service.jpg',
        category: 'api-development',
        technologies: ['Express.js', 'PostgreSQL', 'JWT', 'Swagger'],
        githubUrl: 'https://github.com/username/rest-api',
        liveUrl: 'https://api-docs.example.com',
        stars: 41,
        forks: 18,
        language: 'JavaScript',
        status: 'live',
        createdAt: '2024-01-08',
        updatedAt: '2024-03-12'
      },
      {
        id: 6,
        name: 'Database Design',
        description: 'Comprehensive database design and optimization for a large-scale application. Includes data modeling, indexing strategies, and performance tuning.',
        image: '/images/projects/database.jpg',
        category: 'database',
        technologies: ['PostgreSQL', 'Redis', 'MongoDB', 'SQL'],
        githubUrl: 'https://github.com/username/database-design',
        liveUrl: null,
        stars: 19,
        forks: 7,
        language: 'SQL',
        status: 'archived',
        createdAt: '2023-11-15',
        updatedAt: '2024-02-28'
      }
    ];
  }
  
  /**
   * Handle search input
   */
  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    this.currentFilters.search = searchTerm;
    this.applyFilters();
  }
  
  /**
   * Handle category filter
   */
  handleCategoryFilter(event) {
    const category = event.target.value;
    this.currentFilters.category = category;
    this.applyFilters();
  }
  
  /**
   * Handle sort selection
   */
  handleSort(event) {
    const sortBy = event.target.value;
    this.currentFilters.sort = sortBy;
    this.applyFilters();
  }
  
  /**
   * Apply all filters and update display
   */
  applyFilters() {
    let filtered = [...this.projects];
    
    // Apply search filter
    if (this.currentFilters.search) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(this.currentFilters.search) ||
        project.description.toLowerCase().includes(this.currentFilters.search) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(this.currentFilters.search)
        )
      );
    }
    
    // Apply category filter
    if (this.currentFilters.category) {
      filtered = filtered.filter(project => 
        project.category === this.currentFilters.category
      );
    }
    
    // Apply sorting
    filtered = this.sortProjects(filtered, this.currentFilters.sort);
    
    this.filteredProjects = filtered;
    this.currentPage = 1;
    
    this.renderProjects();
    this.updateCounts();
    this.updateActiveFilters();
  }
  
  /**
   * Sort projects based on criteria
   */
  sortProjects(projects, sortBy) {
    const sorted = [...projects];
    
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'stars-desc':
        return sorted.sort((a, b) => b.stars - a.stars);
      default:
        return sorted;
    }
  }
  
  /**
   * Render projects in the grid
   */
  renderProjects() {
    if (!this.elements.projectsGrid) return;
    
    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);
    
    if (projectsToShow.length === 0) {
      this.showEmptyState();
      return;
    }
    
    const projectsHTML = projectsToShow.map(project => 
      this.createProjectCard(project)
    ).join('');
    
    this.elements.projectsGrid.innerHTML = projectsHTML;
    
    // Add event listeners to project cards
    this.addProjectCardListeners();
  }
  
  /**
   * Create project card HTML
   */
  createProjectCard(project) {
    const statusClass = `project-status-${project.status}`;
    const statusText = this.getStatusText(project.status);
    
    return `
      <article class="project-card" role="listitem" data-project-id="${project.id}">
        <div class="project-image-container">
          ${project.image ? 
            `<img src="${project.image}" alt="${project.name}" class="project-image" loading="lazy">` :
            `<div class="project-image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>`
          }
          <div class="project-status ${statusClass}">
            <span>${statusText}</span>
          </div>
        </div>
        
        <div class="project-content">
          <div class="project-header">
            <h3 class="project-title">
              <a href="#" data-project-id="${project.id}">${project.name}</a>
            </h3>
            <div class="project-stats">
              <div class="project-stat">
                <svg class="project-stat-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>${project.stars}</span>
              </div>
              <div class="project-stat">
                <svg class="project-stat-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>${project.forks}</span>
              </div>
            </div>
          </div>
          
          <p class="project-description">${project.description}</p>
          
          <div class="project-tags">
            ${project.technologies.map(tech => 
              `<span class="project-tag" data-filter="technology" data-value="${tech.toLowerCase()}">${tech}</span>`
            ).join('')}
          </div>
          
          <div class="project-actions">
            ${project.githubUrl ? 
              `<a href="${project.githubUrl}" class="project-action" target="_blank" rel="noopener noreferrer">
                <svg class="project-action-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Code
              </a>` : ''
            }
            ${project.liveUrl ? 
              `<a href="${project.liveUrl}" class="project-action project-action-primary" target="_blank" rel="noopener noreferrer">
                <svg class="project-action-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15,3 21,3 21,9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Live
              </a>` : 
              `<button class="project-action" data-project-id="${project.id}">
                <svg class="project-action-icon" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                Details
              </button>`
            }
          </div>
          
          <div class="project-meta">
            <div class="project-date">
              <svg class="project-date-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${this.formatDate(project.updatedAt)}</span>
            </div>
            <div class="project-language">
              <div class="project-language-dot"></div>
              <span>${project.language}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }
  
  /**
   * Add event listeners to project cards
   */
  addProjectCardListeners() {
    // Project title clicks
    document.querySelectorAll('.project-title a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = parseInt(e.target.dataset.projectId);
        this.openProjectModal(projectId);
      });
    });
    
    // Project action buttons
    document.querySelectorAll('.project-action[data-project-id]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = parseInt(e.target.dataset.projectId);
        this.openProjectModal(projectId);
      });
    });
    
    // Technology tag clicks
    document.querySelectorAll('.project-tag[data-filter="technology"]').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        const technology = e.target.dataset.value;
        this.filterByTechnology(technology);
      });
    });
  }
  
  /**
   * Open project modal
   */
  openProjectModal(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    
    if (this.elements.modalTitle) {
      this.elements.modalTitle.textContent = project.name;
    }
    
    if (this.elements.modalContent) {
      this.elements.modalContent.innerHTML = this.createModalContent(project);
    }
    
    if (this.elements.modal) {
      this.elements.modal.setAttribute('aria-hidden', 'false');
      this.elements.modal.style.display = 'flex';
      
      // Focus management
      setTimeout(() => {
        this.elements.modalClose?.focus();
      }, 100);
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Create modal content
   */
  createModalContent(project) {
    return `
      <div class="modal-project-details">
        <div class="modal-project-image">
          ${project.image ? 
            `<img src="${project.image}" alt="${project.name}" loading="lazy">` :
            `<div class="modal-project-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>`
          }
        </div>
        
        <div class="modal-project-info">
          <p class="modal-project-description">${project.description}</p>
          
          <div class="modal-project-details-grid">
            <div class="modal-detail-item">
              <strong>Category:</strong>
              <span>${this.getCategoryText(project.category)}</span>
            </div>
            <div class="modal-detail-item">
              <strong>Language:</strong>
              <span>${project.language}</span>
            </div>
            <div class="modal-detail-item">
              <strong>Status:</strong>
              <span class="status-badge status-${project.status}">${this.getStatusText(project.status)}</span>
            </div>
            <div class="modal-detail-item">
              <strong>Created:</strong>
              <span>${this.formatDate(project.createdAt)}</span>
            </div>
            <div class="modal-detail-item">
              <strong>Updated:</strong>
              <span>${this.formatDate(project.updatedAt)}</span>
            </div>
            <div class="modal-detail-item">
              <strong>Stars:</strong>
              <span>${project.stars}</span>
            </div>
          </div>
          
          <div class="modal-project-technologies">
            <h4>Technologies Used</h4>
            <div class="technology-tags">
              ${project.technologies.map(tech => 
                `<span class="technology-tag">${tech}</span>`
              ).join('')}
            </div>
          </div>
          
          <div class="modal-project-links">
            ${project.githubUrl ? 
              `<a href="${project.githubUrl}" class="modal-link" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>` : ''
            }
            ${project.liveUrl ? 
              `<a href="${project.liveUrl}" class="modal-link" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15,3 21,3 21,9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Visit Live Site
              </a>` : ''
            }
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Close modal
   */
  closeModal() {
    if (this.elements.modal) {
      this.elements.modal.setAttribute('aria-hidden', 'true');
      this.elements.modal.style.display = 'none';
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
  
  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    // Close modal with Escape key
    if (event.key === 'Escape' && this.elements.modal?.getAttribute('aria-hidden') === 'false') {
      this.closeModal();
    }
  }
  
  /**
   * Handle GitHub connect
   */
  handleGitHubConnect() {
    // In a real implementation, this would redirect to GitHub OAuth
    alert('GitHub integration would be implemented here. This would allow automatic syncing of your repositories.');
  }
  
  /**
   * Filter by technology
   */
  filterByTechnology(technology) {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = technology;
      this.currentFilters.search = technology;
      this.applyFilters();
    }
  }
  
  /**
   * Update active filters display
   */
  updateActiveFilters() {
    if (!this.elements.activeFilters) return;
    
    const activeFilters = [];
    
    if (this.currentFilters.search) {
      activeFilters.push({
        type: 'search',
        label: `Search: "${this.currentFilters.search}"`,
        value: this.currentFilters.search
      });
    }
    
    if (this.currentFilters.category) {
      activeFilters.push({
        type: 'category',
        label: `Category: ${this.getCategoryText(this.currentFilters.category)}`,
        value: this.currentFilters.category
      });
    }
    
    if (activeFilters.length === 0) {
      this.elements.activeFilters.innerHTML = '';
      return;
    }
    
    const filtersHTML = activeFilters.map(filter => `
      <span class="active-filter">
        ${filter.label}
        <button class="active-filter-remove" data-filter-type="${filter.type}" data-filter-value="${filter.value}">
          <span class="sr-only">Remove ${filter.label}</span>
        </button>
      </span>
    `).join('');
    
    this.elements.activeFilters.innerHTML = filtersHTML;
    
    // Add event listeners to remove buttons
    this.elements.activeFilters.querySelectorAll('.active-filter-remove').forEach(button => {
      button.addEventListener('click', (e) => {
        const filterType = e.target.dataset.filterType;
        const filterValue = e.target.dataset.filterValue;
        this.removeFilter(filterType, filterValue);
      });
    });
  }
  
  /**
   * Remove filter
   */
  removeFilter(filterType, filterValue) {
    switch (filterType) {
      case 'search':
        this.currentFilters.search = '';
        if (this.elements.searchInput) {
          this.elements.searchInput.value = '';
        }
        break;
      case 'category':
        this.currentFilters.category = '';
        if (this.elements.categoryFilter) {
          this.elements.categoryFilter.value = '';
        }
        break;
    }
    
    this.applyFilters();
  }
  
  /**
   * Update project counts
   */
  updateCounts() {
    if (this.elements.visibleCount) {
      this.elements.visibleCount.textContent = this.filteredProjects.length;
    }
    
    if (this.elements.totalCount) {
      this.elements.totalCount.textContent = this.projects.length;
    }
  }
  
  /**
   * Show empty state
   */
  showEmptyState() {
    if (this.elements.projectsGrid) {
      this.elements.projectsGrid.innerHTML = '';
    }
    
    if (this.elements.projectsEmpty) {
      this.elements.projectsEmpty.hidden = false;
    }
  }
  
  /**
   * Set loading state
   */
  setLoading(loading) {
    this.isLoading = loading;
    
    if (this.elements.projectsLoading) {
      this.elements.projectsLoading.style.display = loading ? 'flex' : 'none';
    }
    
    if (this.elements.projectsGrid) {
      this.elements.projectsGrid.style.display = loading ? 'none' : 'grid';
    }
    
    if (this.elements.projectsEmpty) {
      this.elements.projectsEmpty.hidden = loading || this.filteredProjects.length > 0;
    }
  }
  
  /**
   * Show error message
   */
  showError(message) {
    if (this.elements.projectsGrid) {
      this.elements.projectsGrid.innerHTML = `
        <div class="error-state">
          <svg class="error-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h3 class="error-title">Error Loading Projects</h3>
          <p class="error-message">${message}</p>
          <button class="btn btn-primary" onclick="location.reload()">
            Try Again
          </button>
        </div>
      `;
    }
  }
  
  /**
   * Setup intersection observer for lazy loading
   */
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      // Observe lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
      });
    }
  }
  
  /**
   * Update tooltips
   */
  updateTooltips() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      themeToggle.setAttribute('data-tooltip', `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`);
    }
  }
  
  /**
   * Utility functions
   */
  getStatusText(status) {
    const statusMap = {
      'live': 'Live',
      'development': 'In Development',
      'archived': 'Archived'
    };
    return statusMap[status] || status;
  }
  
  getCategoryText(category) {
    const categoryMap = {
      'web-development': 'Web Development',
      'data-analysis': 'Data Analysis',
      'machine-learning': 'Machine Learning',
      'mobile-app': 'Mobile App',
      'api-development': 'API Development',
      'database': 'Database'
    };
    return categoryMap[category] || category;
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// ========================================
// Initialize Portfolio Manager
// ========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioManager();
});

// Export for global access (if needed)
window.PortfolioManager = PortfolioManager; 