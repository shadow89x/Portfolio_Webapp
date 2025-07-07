# Development Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Coding Standards](#coding-standards)
6. [CSS Architecture](#css-architecture)
7. [JavaScript Architecture](#javascript-architecture)
8. [Performance Guidelines](#performance-guidelines)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [Testing Strategy](#testing-strategy)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

This is a personal portfolio website built with modern web technologies. The project demonstrates best practices in web development, focusing on performance, accessibility, and maintainability.

### Key Features

- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Dark/Light Mode**: User preference-based theme switching
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized loading and rendering
- **SEO**: Search engine optimization best practices
- **Progressive Web App**: Offline support and installable

### Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties
- **JavaScript (ES6+)**: Vanilla JS with modern features
- **Vite**: Build tool and development server
- **Git**: Version control

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd optical_warehouse_web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
optical_warehouse_web/
├── docs/                    # Documentation
│   ├── development/        # Development guides
│   ├── design/            # Design specifications
│   └── deployment/        # Deployment guides
├── src/                    # Source code
│   ├── pages/             # Individual pages
│   │   ├── home/          # Home page
│   │   ├── portfolio/     # Portfolio pages
│   │   └── contact/       # Contact page
│   ├── components/        # Reusable components
│   ├── styles/           # CSS files
│   │   ├── base/         # Base styles
│   │   ├── components/   # Component styles
│   │   └── pages/        # Page-specific styles
│   ├── scripts/          # JavaScript files
│   │   ├── utils/        # Utility functions
│   │   ├── components/   # Component logic
│   │   └── pages/        # Page-specific scripts
│   └── assets/           # Static assets
│       ├── images/       # Images and icons
│       ├── fonts/        # Custom fonts
│       └── data/         # JSON data files
├── public/               # Public static files
├── package.json          # Project configuration
├── vite.config.js        # Vite configuration
└── README.md            # Project overview
```

## 🔄 Development Workflow

### 1. Feature Development

1. **Create a feature branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes**
   - Follow coding standards
   - Write meaningful commit messages
   - Test your changes

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/feature-name
   ```

### 2. Code Review Process

- Self-review before submitting
- Ensure all tests pass
- Check accessibility compliance
- Verify performance impact
- Update documentation if needed

### 3. Deployment Process

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Test production build**
   ```bash
   npm run preview
   ```

3. **Deploy to hosting platform**
   - GitHub Pages
   - Netlify
   - Vercel

## 📝 Coding Standards

### HTML Standards

- Use semantic HTML5 elements
- Include proper ARIA attributes
- Ensure proper heading hierarchy
- Add alt text to images
- Use descriptive link text

```html
<!-- Good -->
<main role="main">
  <h1>Page Title</h1>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</main>

<!-- Bad -->
<div>
  <div>Page Title</div>
  <div>
    <div><a href="/">Click here</a></div>
  </div>
</div>
```

### CSS Standards

- Use CSS custom properties for theming
- Follow BEM methodology for component naming
- Use relative units (rem, em, %)
- Avoid !important declarations
- Group related properties

```css
/* Good */
.button {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.button--primary {
  background-color: var(--color-primary-600);
  color: var(--color-text-inverse);
}

/* Bad */
.btn {
  padding: 16px !important;
  border-radius: 8px;
  background: #2563eb;
}
```

### JavaScript Standards

- Use ES6+ features
- Follow functional programming principles
- Use meaningful variable names
- Add JSDoc comments for functions
- Handle errors gracefully

```javascript
/**
 * Toggle theme between light and dark
 * @param {string} theme - The theme to apply
 */
function toggleTheme(theme) {
  try {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}
```

## 🎨 CSS Architecture

### Design System

The CSS architecture follows a design system approach with:

- **CSS Custom Properties**: For theming and consistency
- **Utility Classes**: For common patterns
- **Component Classes**: For specific components
- **Page Classes**: For page-specific styles

### File Organization

```
src/styles/
├── base/              # Foundation styles
│   ├── variables.css  # CSS custom properties
│   ├── reset.css      # CSS reset
│   ├── typography.css # Typography system
│   └── layout.css     # Layout utilities
├── components/        # Reusable components
│   ├── navigation.css # Navigation styles
│   ├── buttons.css    # Button styles
│   └── forms.css      # Form styles
└── pages/            # Page-specific styles
    ├── home.css      # Home page styles
    └── portfolio.css # Portfolio page styles
```

### Naming Conventions

- **Components**: `.component-name`
- **Modifiers**: `.component-name--modifier`
- **States**: `.component-name.is-active`
- **Utilities**: `.u-utility-name`

## ⚡ JavaScript Architecture

### Module Organization

The JavaScript follows a modular architecture with:

- **Classes**: For complex functionality
- **Utilities**: For helper functions
- **Event Handlers**: For user interactions
- **State Management**: For application state

### Key Classes

- `ThemeManager`: Handles theme switching
- `NavigationManager`: Manages navigation
- `IntersectionObserverManager`: Handles scroll animations
- `PerformanceOptimizer`: Optimizes performance
- `AccessibilityManager`: Enhances accessibility

### Error Handling

```javascript
class ErrorHandler {
  handleError(error) {
    console.error('Error occurred:', error);
    
    if (error.message.includes('Failed to fetch')) {
      this.showErrorMessage('Network error. Please check your connection.');
    }
  }
}
```

## 🚀 Performance Guidelines

### Loading Performance

- **Critical CSS**: Inline critical styles
- **Lazy Loading**: Load images and components on demand
- **Resource Hints**: Use preload and prefetch
- **Code Splitting**: Split code by routes

### Runtime Performance

- **Event Delegation**: Use event delegation for dynamic content
- **Debouncing**: Debounce scroll and resize events
- **RequestAnimationFrame**: Use for smooth animations
- **Memory Management**: Clean up event listeners

### Optimization Techniques

```javascript
// Debounced scroll handler
function debounce(func, wait) {
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

const handleScroll = debounce(() => {
  // Scroll handling logic
}, 16);
```

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Visible focus indicators

### Implementation Examples

```html
<!-- Proper ARIA usage -->
<button 
  aria-expanded="false" 
  aria-controls="mobile-menu"
  aria-label="Toggle mobile menu">
  <span class="hamburger-line"></span>
</button>

<nav id="mobile-menu" aria-hidden="true">
  <!-- Menu items -->
</nav>
```

```css
/* Focus indicators */
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}
```

## 🧪 Testing Strategy

### Manual Testing

- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Mobile, tablet, desktop
- **Accessibility Testing**: Screen readers, keyboard navigation
- **Performance Testing**: Lighthouse audits

### Automated Testing

```javascript
// Example test structure
describe('ThemeManager', () => {
  test('should toggle theme correctly', () => {
    const themeManager = new ThemeManager();
    const initialTheme = themeManager.currentTheme;
    
    themeManager.toggleTheme();
    
    expect(themeManager.currentTheme).not.toBe(initialTheme);
  });
});
```

### Performance Testing

- **Lighthouse**: Core Web Vitals
- **WebPageTest**: Detailed performance analysis
- **Bundle Analyzer**: JavaScript bundle size

## 🚀 Deployment

### Build Process

1. **Optimize assets**
   - Minify CSS and JavaScript
   - Optimize images
   - Generate service worker

2. **Generate static files**
   ```bash
   npm run build
   ```

3. **Test production build**
   ```bash
   npm run preview
   ```

### Deployment Platforms

#### GitHub Pages

1. **Configure repository**
   ```bash
   git remote add origin https://github.com/username/repo.git
   ```

2. **Deploy**
   ```bash
   npm run build
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

#### Netlify

1. **Connect repository**
   - Link GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Configure environment**
   - Set environment variables if needed
   - Configure redirects

#### Vercel

1. **Import project**
   - Connect GitHub repository
   - Vercel auto-detects Vite configuration

2. **Deploy**
   - Automatic deployment on push
   - Preview deployments for PRs

## 🔧 Troubleshooting

### Common Issues

#### Development Server Not Starting

```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors

```bash
# Check for syntax errors
npm run lint

# Check for missing dependencies
npm ls

# Clear build cache
rm -rf dist
```

#### Performance Issues

1. **Check bundle size**
   ```bash
   npm run build
   # Check dist folder size
   ```

2. **Analyze with Lighthouse**
   - Open Chrome DevTools
   - Run Lighthouse audit
   - Address performance issues

### Debug Tools

- **Chrome DevTools**: Network, Performance, Console
- **Lighthouse**: Performance and accessibility audits
- **WebPageTest**: Detailed performance analysis
- **Accessibility DevTools**: Accessibility testing

### Getting Help

1. **Check documentation**
2. **Search existing issues**
3. **Create detailed bug report**
4. **Provide reproduction steps**

## 📚 Additional Resources

### Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)
- [Web.dev](https://web.dev/)

### Tools and Extensions

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Live Server
  - CSS Peek

- **Browser Extensions**:
  - Lighthouse
  - Web Developer
  - ColorZilla

### Best Practices

- **Performance**: [Web Performance Best Practices](https://web.dev/performance/)
- **Accessibility**: [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- **SEO**: [Google SEO Guide](https://developers.google.com/search/docs)

---

**Note**: This development guide is a living document. Please update it as the project evolves and new patterns emerge. 