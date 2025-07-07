/**
 * Portfolio Analytics Dashboard
 * 
 * This module handles the dashboard functionality including:
 * - GitHub API integration for repository statistics
 * - Interactive charts and visualizations
 * - PowerBI dashboard integration
 * - Real-time data updates
 * - Data export functionality
 * - Performance monitoring
 */

import { GitHubAPI } from './github-api.js';

class Dashboard {
    constructor() {
        this.githubAPI = new GitHubAPI();
        this.charts = {};
        this.metrics = {};
        this.updateInterval = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            await this.setupEventListeners();
            await this.loadDashboardData();
            this.startRealTimeUpdates();
            this.isInitialized = true;
            
            console.log('Dashboard initialized successfully');
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Failed to load dashboard data. Please refresh the page.');
        }
    }
    
    async setupEventListeners() {
        // Refresh data button
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
        
        // Export data button
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        // PowerBI setup
        const loadPowerBIBtn = document.getElementById('load-powerbi');
        if (loadPowerBIBtn) {
            loadPowerBIBtn.addEventListener('click', () => this.loadPowerBIDashboard());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.refreshData();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportData();
                        break;
                }
            }
        });
        
        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe metric cards and chart containers
        document.querySelectorAll('.metric-card, .chart-container').forEach(el => {
            observer.observe(el);
        });
    }
    
    async loadDashboardData() {
        try {
            this.showLoading();
            
            // Load GitHub data
            await this.loadGitHubMetrics();
            
            // Load performance data
            await this.loadPerformanceMetrics();
            
            // Initialize charts
            await this.initializeCharts();
            
            // Check PowerBI configuration
            this.checkPowerBIConfig();
            
            this.hideLoading();
            this.showSuccess('Dashboard data loaded successfully');
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.hideLoading();
            this.showError('Failed to load dashboard data. Please try again.');
        }
    }
    
    async loadGitHubMetrics() {
        try {
            const userData = await this.githubAPI.getUserInfo();
            const repos = await this.githubAPI.getRepositories();
            
            // Calculate metrics
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
            const totalRepos = repos.length;
            
            // Update metric cards
            this.updateMetric('total-repos', totalRepos);
            this.updateMetric('total-stars', totalStars);
            this.updateMetric('total-forks', totalForks);
            
            // Calculate changes (mock data for now)
            this.updateMetricChange('repos-change', '+5%');
            this.updateMetricChange('stars-change', '+12%');
            this.updateMetricChange('forks-change', '+8%');
            
            // Store data for charts
            this.metrics.githubData = {
                user: userData,
                repositories: repos,
                stats: {
                    totalRepos,
                    totalStars,
                    totalForks
                }
            };
            
        } catch (error) {
            console.error('Error loading GitHub metrics:', error);
            this.updateMetric('total-repos', 'Error');
            this.updateMetric('total-stars', 'Error');
            this.updateMetric('total-forks', 'Error');
        }
    }
    
    async loadPerformanceMetrics() {
        try {
            // Simulate performance data
            const performanceData = {
                loadTime: '1.2s',
                pageSize: '2.1MB',
                seoScore: '95/100',
                bounceRate: '32%',
                avgSession: '2m 45s',
                pagesSession: '3.2'
            };
            
            // Update performance metrics
            this.updateMetric('load-time', performanceData.loadTime);
            this.updateMetric('page-size', performanceData.pageSize);
            this.updateMetric('seo-score', performanceData.seoScore);
            this.updateMetric('bounce-rate', performanceData.bounceRate);
            this.updateMetric('avg-session', performanceData.avgSession);
            this.updateMetric('pages-session', performanceData.pagesSession);
            
            // Simulate portfolio views
            const portfolioViews = Math.floor(Math.random() * 1000) + 500;
            this.updateMetric('portfolio-views', portfolioViews.toLocaleString());
            this.updateMetricChange('views-change', '+15%');
            
            this.metrics.performanceData = performanceData;
            
        } catch (error) {
            console.error('Error loading performance metrics:', error);
        }
    }
    
    async initializeCharts() {
        try {
            // Language distribution chart
            await this.createLanguageChart();
            
            // Repository activity chart
            await this.createActivityChart();
            
            // Top repositories chart
            await this.createTopReposChart();
            
            // Contribution timeline chart
            await this.createContributionChart();
            
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }
    
    async createLanguageChart() {
        const chartContainer = document.getElementById('languages-chart');
        if (!chartContainer || !this.metrics.githubData) return;
        
        const repos = this.metrics.githubData.repositories;
        const languages = {};
        
        // Count languages
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        
        // Create chart data
        const chartData = Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([language, count]) => ({
                language,
                count,
                percentage: ((count / repos.length) * 100).toFixed(1)
            }));
        
        // Create simple bar chart
        const chartHTML = this.createBarChart(chartData, 'languages');
        chartContainer.innerHTML = chartHTML;
    }
    
    async createActivityChart() {
        const chartContainer = document.getElementById('activity-chart');
        if (!chartContainer || !this.metrics.githubData) return;
        
        const repos = this.metrics.githubData.repositories;
        
        // Group by creation month
        const activityData = {};
        repos.forEach(repo => {
            const date = new Date(repo.created_at);
            const month = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            activityData[month] = (activityData[month] || 0) + 1;
        });
        
        // Create chart data
        const chartData = Object.entries(activityData)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([month, count]) => ({ month, count }));
        
        // Create simple line chart
        const chartHTML = this.createLineChart(chartData, 'activity');
        chartContainer.innerHTML = chartHTML;
    }
    
    async createTopReposChart() {
        const chartContainer = document.getElementById('top-repos-chart');
        if (!chartContainer || !this.metrics.githubData) return;
        
        const repos = this.metrics.githubData.repositories;
        
        // Sort by stars
        const topRepos = repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5)
            .map(repo => ({
                name: repo.name,
                stars: repo.stargazers_count,
                forks: repo.forks_count
            }));
        
        // Create chart HTML
        const chartHTML = this.createTopReposList(topRepos);
        chartContainer.innerHTML = chartHTML;
    }
    
    async createContributionChart() {
        const chartContainer = document.getElementById('contribution-chart');
        if (!chartContainer) return;
        
        // Create contribution grid (GitHub-style)
        const chartHTML = this.createContributionGrid();
        chartContainer.innerHTML = chartHTML;
    }
    
    createBarChart(data, type) {
        const maxValue = Math.max(...data.map(d => d.count));
        
        return `
            <div class="chart-content">
                ${data.map(item => `
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">${item.language}</div>
                        <div class="chart-bar-container">
                            <div class="chart-bar" style="width: ${(item.count / maxValue) * 100}%"></div>
                        </div>
                        <div class="chart-bar-value">${item.count} (${item.percentage}%)</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    createLineChart(data, type) {
        const maxValue = Math.max(...data.map(d => d.count));
        const points = data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.count / maxValue) * 100);
            return `${x}% ${y}%`;
        }).join(', ');
        
        return `
            <div class="chart-content">
                <svg viewBox="0 0 100 100" class="line-chart">
                    <polyline points="${points}" fill="none" stroke="var(--color-primary)" stroke-width="2"/>
                    ${data.map((item, index) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = 100 - ((item.count / maxValue) * 100);
                        return `<circle cx="${x}" cy="${y}" r="2" fill="var(--color-primary)"/>`;
                    }).join('')}
                </svg>
                <div class="chart-labels">
                    ${data.map(item => `<span>${item.month}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    createTopReposList(repos) {
        return `
            <div class="chart-content">
                ${repos.map((repo, index) => `
                    <div class="repo-item">
                        <div class="repo-rank">#${index + 1}</div>
                        <div class="repo-info">
                            <div class="repo-name">${repo.name}</div>
                            <div class="repo-stats">
                                <span class="repo-stars">⭐ ${repo.stars}</span>
                                <span class="repo-forks">🔀 ${repo.forks}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    createContributionGrid() {
        // Create a 7x52 grid (1 year of contributions)
        const weeks = 52;
        const days = 7;
        let gridHTML = '<div class="contribution-grid">';
        
        for (let week = 0; week < weeks; week++) {
            for (let day = 0; day < days; day++) {
                const intensity = Math.floor(Math.random() * 5); // 0-4
                const colorClass = `contribution-${intensity}`;
                gridHTML += `<div class="contribution-day ${colorClass}" title="Contributions: ${intensity}"></div>`;
            }
        }
        
        gridHTML += '</div>';
        gridHTML += '<div class="contribution-legend">';
        gridHTML += '<span>Less</span>';
        for (let i = 0; i < 5; i++) {
            gridHTML += `<div class="contribution-legend-item contribution-${i}"></div>`;
        }
        gridHTML += '<span>More</span>';
        gridHTML += '</div>';
        
        return gridHTML;
    }
    
    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            element.classList.add('updated');
            setTimeout(() => element.classList.remove('updated'), 1000);
        }
    }
    
    updateMetricChange(elementId, change) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = change;
            element.className = `metric-change ${change.startsWith('+') ? 'metric-positive' : 'metric-negative'}`;
        }
    }
    
    checkPowerBIConfig() {
        const powerbiUrl = localStorage.getItem('powerbi-url');
        const powerbiContainer = document.getElementById('powerbi-embed');
        const setupContainer = document.getElementById('powerbi-setup');
        
        if (powerbiUrl) {
            // Load PowerBI dashboard
            this.loadPowerBIDashboard(powerbiUrl);
        } else {
            // Show setup form
            if (setupContainer) {
                setupContainer.style.display = 'block';
            }
        }
    }
    
    async loadPowerBIDashboard(url = null) {
        const powerbiContainer = document.getElementById('powerbi-embed');
        if (!powerbiContainer) return;
        
        try {
            const embedUrl = url || document.getElementById('powerbi-url')?.value;
            if (!embedUrl) {
                throw new Error('PowerBI URL is required');
            }
            
            // Store URL for future use
            localStorage.setItem('powerbi-url', embedUrl);
            
            // Create iframe for PowerBI embed
            powerbiContainer.innerHTML = `
                <iframe 
                    src="${embedUrl}"
                    width="100%" 
                    height="600" 
                    frameborder="0"
                    allowFullScreen="true"
                    title="PowerBI Dashboard">
                </iframe>
            `;
            
            this.showSuccess('PowerBI dashboard loaded successfully');
            
        } catch (error) {
            console.error('Error loading PowerBI dashboard:', error);
            this.showError('Failed to load PowerBI dashboard. Please check the URL.');
        }
    }
    
    async refreshData() {
        try {
            this.showLoading();
            await this.loadDashboardData();
            this.showSuccess('Data refreshed successfully');
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showError('Failed to refresh data. Please try again.');
        }
    }
    
    async exportData() {
        try {
            const data = {
                timestamp: new Date().toISOString(),
                github: this.metrics.githubData,
                performance: this.metrics.performanceData
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio-dashboard-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccess('Data exported successfully');
            
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showError('Failed to export data. Please try again.');
        }
    }
    
    startRealTimeUpdates() {
        // Update data every 5 minutes
        this.updateInterval = setInterval(() => {
            this.loadPerformanceMetrics();
        }, 5 * 60 * 1000);
    }
    
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    showLoading() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => card.classList.add('loading'));
    }
    
    hideLoading() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => card.classList.remove('loading'));
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => document.body.removeChild(notification), 300);
            });
        }
    }
    
    destroy() {
        this.stopRealTimeUpdates();
        this.isInitialized = false;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.destroy();
    }
});

// Export for module usage
export { Dashboard }; 