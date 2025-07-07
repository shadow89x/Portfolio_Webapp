# Figma Design Guide

## 📋 Table of Contents

1. [Design System Overview](#design-system-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Library](#component-library)
6. [Layout Grids](#layout-grids)
7. [Icon System](#icon-system)
8. [Design Tokens](#design-tokens)
9. [Responsive Design](#responsive-design)
10. [Accessibility Guidelines](#accessibility-guidelines)
11. [Figma File Structure](#figma-file-structure)
12. [Design Workflow](#design-workflow)

## 🎨 Design System Overview

This design guide outlines the visual design system for the portfolio website. The design follows modern principles of clean, accessible, and professional aesthetics.

### Design Principles

- **Simplicity**: Clean, uncluttered interfaces
- **Accessibility**: High contrast and readable typography
- **Consistency**: Unified design language across all components
- **Responsiveness**: Mobile-first design approach
- **Performance**: Optimized for fast loading and smooth interactions

### Design Philosophy

The design system emphasizes:
- **Professional appearance** suitable for a portfolio
- **Modern aesthetics** with subtle animations
- **Accessibility compliance** (WCAG 2.1 AA)
- **Cross-platform consistency** across devices

## 🎨 Color Palette

### Primary Colors

```
Primary Blue
- 50: #eff6ff   (Lightest)
- 100: #dbeafe
- 200: #bfdbfe
- 300: #93c5fd
- 400: #60a5fa
- 500: #3b82f6
- 600: #2563eb   (Main)
- 700: #1d4ed8
- 800: #1e40af
- 900: #1e3a8a   (Darkest)
```

### Secondary Colors

```
Neutral Gray
- 50: #f8fafc   (Lightest)
- 100: #f1f5f9
- 200: #e2e8f0
- 300: #cbd5e1
- 400: #94a3b8
- 500: #64748b   (Main)
- 600: #475569
- 700: #334155
- 800: #1e293b
- 900: #0f172a   (Darkest)
```

### Accent Colors

```
Warm Orange
- 50: #fffbeb   (Lightest)
- 100: #fef3c7
- 200: #fde68a
- 300: #fcd34d
- 400: #fbbf24
- 500: #f59e0b   (Main)
- 600: #d97706
- 700: #b45309
- 800: #92400e
- 900: #78350f   (Darkest)
```

### Semantic Colors

```
Success (Green)
- 50: #f0fdf4
- 500: #22c55e
- 600: #16a34a

Warning (Yellow)
- 50: #fffbeb
- 500: #f59e0b
- 600: #d97706

Error (Red)
- 50: #fef2f2
- 500: #ef4444
- 600: #dc2626
```

### Theme Colors

#### Light Theme
```
Background: #ffffff
Surface: #ffffff
Surface Elevated: #f8fafc
Surface Hover: #f1f5f9

Text Primary: #1e293b
Text Secondary: #64748b
Text Tertiary: #94a3b8
Text Inverse: #ffffff

Border: #e2e8f0
Border Focus: #3b82f6
```

#### Dark Theme
```
Background: #0f172a
Surface: #1e293b
Surface Elevated: #334155
Surface Hover: #475569

Text Primary: #f8fafc
Text Secondary: #cbd5e1
Text Tertiary: #94a3b8
Text Inverse: #1e293b

Border: #334155
Border Focus: #60a5fa
```

## 📝 Typography

### Font Families

```
Primary Font: Inter
- Weights: 300, 400, 500, 600, 700, 800
- Style: Sans-serif
- Usage: Body text, headings, UI elements

Monospace Font: JetBrains Mono
- Weights: 400, 500, 600, 700
- Style: Monospace
- Usage: Code blocks, technical content
```

### Font Sizes

```
Display: 60px (3.75rem)
Heading 1: 48px (3rem)
Heading 2: 36px (2.25rem)
Heading 3: 30px (1.875rem)
Heading 4: 24px (1.5rem)
Heading 5: 20px (1.25rem)
Heading 6: 18px (1.125rem)

Body Large: 18px (1.125rem)
Body: 16px (1rem)
Body Small: 14px (0.875rem)
Caption: 12px (0.75rem)
```

### Line Heights

```
Tight: 1.25 (for headings)
Normal: 1.5 (for body text)
Relaxed: 1.75 (for large text blocks)
```

### Letter Spacing

```
Tight: -0.025em (for headings)
Normal: 0 (for body text)
Wide: 0.025em (for uppercase text)
```

## 📏 Spacing System

### Base Spacing Unit
```
Base Unit: 4px (0.25rem)
```

### Spacing Scale
```
0: 0px
1: 4px (0.25rem)
2: 8px (0.5rem)
3: 12px (0.75rem)
4: 16px (1rem)
5: 20px (1.25rem)
6: 24px (1.5rem)
8: 32px (2rem)
10: 40px (2.5rem)
12: 48px (3rem)
16: 64px (4rem)
20: 80px (5rem)
24: 96px (6rem)
32: 128px (8rem)
```

### Usage Guidelines

- **Component padding**: Use spacing 4, 6, 8
- **Section spacing**: Use spacing 12, 16, 20, 24
- **Page margins**: Use spacing 4, 6, 8
- **Grid gaps**: Use spacing 4, 6, 8

## 🧩 Component Library

### Buttons

#### Primary Button
```
Background: Primary 600
Text: White
Border: Primary 600
Border Radius: 8px
Padding: 12px 24px
Font: Inter Medium 16px
Hover: Primary 700, shadow
```

#### Secondary Button
```
Background: Transparent
Text: Primary 600
Border: Primary 600
Border Radius: 8px
Padding: 12px 24px
Font: Inter Medium 16px
Hover: Primary 600 background, white text
```

#### Ghost Button
```
Background: Transparent
Text: Text Primary
Border: Transparent
Border Radius: 8px
Padding: 12px 24px
Font: Inter Medium 16px
Hover: Surface Hover background
```

### Cards

#### Project Card
```
Background: Surface
Border: Border color
Border Radius: 12px
Padding: 24px
Shadow: Subtle shadow
Hover: Elevated shadow, border color change
```

#### Skill Card
```
Background: Surface Elevated
Border: Border color
Border Radius: 12px
Padding: 24px
Shadow: Subtle shadow
Hover: Elevated shadow, border color change
```

### Navigation

#### Header
```
Background: Background color
Border: Border color (bottom)
Height: 64px
Padding: 16px 0
Shadow: On scroll
```

#### Navigation Link
```
Text: Text Secondary
Font: Inter Medium 16px
Padding: 8px 12px
Border Radius: 8px
Hover: Text Primary, Surface Hover background
Active: Primary 600, Primary 50 background
```

### Forms

#### Input Field
```
Background: Surface
Border: Border color
Border Radius: 8px
Padding: 12px 16px
Font: Inter Regular 16px
Focus: Border Focus color, outline
```

#### Textarea
```
Background: Surface
Border: Border color
Border Radius: 8px
Padding: 12px 16px
Font: Inter Regular 16px
Min Height: 100px
Resize: Vertical only
```

## 📐 Layout Grids

### Desktop Grid (1200px+)
```
Columns: 12
Gutter: 24px
Margin: 24px
Max Width: 1280px
```

### Tablet Grid (768px - 1199px)
```
Columns: 8
Gutter: 20px
Margin: 20px
Max Width: 1024px
```

### Mobile Grid (320px - 767px)
```
Columns: 4
Gutter: 16px
Margin: 16px
Max Width: 768px
```

### Breakpoints
```
Mobile: 320px - 767px
Tablet: 768px - 1199px
Desktop: 1200px+
```

## 🎯 Icon System

### Icon Style
```
Style: Outlined
Weight: 2px stroke
Size: 24px (default)
Color: Inherit from parent
```

### Icon Sizes
```
Small: 16px
Medium: 24px (default)
Large: 32px
Extra Large: 48px
```

### Icon Categories
```
Navigation: Menu, close, arrow
Actions: Edit, delete, share
Status: Success, warning, error
Social: GitHub, LinkedIn, email
```

### Icon Usage Guidelines
- Use consistent stroke weight
- Maintain visual balance
- Ensure accessibility with proper labels
- Scale proportionally

## 🎨 Design Tokens

### CSS Custom Properties
```css
/* Colors */
--color-primary-600: #2563eb;
--color-secondary-500: #64748b;
--color-accent-500: #f59e0b;

/* Typography */
--font-family-sans: 'Inter', sans-serif;
--font-size-base: 1rem;
--line-height-normal: 1.5;

/* Spacing */
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;

/* Border Radius */
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

### Figma Tokens
```
Colors: Organized by theme and semantic meaning
Typography: Font families, sizes, weights, line heights
Spacing: Consistent spacing scale
Shadows: Elevation levels
Border Radius: Component corner radius
```

## 📱 Responsive Design

### Mobile-First Approach
1. **Design for mobile first** (320px width)
2. **Progressive enhancement** for larger screens
3. **Touch-friendly interactions** (44px minimum touch targets)
4. **Simplified navigation** for mobile

### Responsive Patterns

#### Navigation
```
Mobile: Hamburger menu, full-screen overlay
Tablet: Horizontal menu, reduced spacing
Desktop: Full horizontal menu
```

#### Grid Layouts
```
Mobile: Single column, stacked
Tablet: Two columns, reduced gaps
Desktop: Multi-column, full spacing
```

#### Typography
```
Mobile: Smaller font sizes, tighter line heights
Tablet: Medium font sizes
Desktop: Full font sizes, relaxed line heights
```

### Content Adaptation
- **Images**: Responsive with proper aspect ratios
- **Text**: Readable on all screen sizes
- **Interactive elements**: Touch-friendly on mobile
- **Spacing**: Proportional to screen size

## ♿ Accessibility Guidelines

### Color Contrast
```
Normal Text: 4.5:1 minimum ratio
Large Text: 3:1 minimum ratio
UI Components: 3:1 minimum ratio
```

### Focus Indicators
```
Style: 2px solid border
Color: Primary 600
Offset: 2px from element
Visible: Always on keyboard navigation
```

### Touch Targets
```
Minimum Size: 44px × 44px
Spacing: 8px between targets
Accessible: Clear visual feedback
```

### Screen Reader Support
```
Semantic HTML: Proper heading hierarchy
ARIA Labels: Descriptive labels for interactive elements
Alt Text: Meaningful descriptions for images
Landmarks: Proper page structure
```

## 📁 Figma File Structure

### File Organization
```
Portfolio Website Design
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Shadows
├── 🧩 Components
│   ├── Buttons
│   ├── Cards
│   ├── Navigation
│   ├── Forms
│   └── Icons
├── 📱 Pages
│   ├── Home
│   ├── Portfolio
│   ├── Contact
│   └── Project Details
├── 📐 Layouts
│   ├── Desktop
│   ├── Tablet
│   └── Mobile
└── 🎯 Assets
    ├── Images
    ├── Icons
    └── Illustrations
```

### Component Organization
```
Components
├── Atoms (Basic elements)
│   ├── Buttons
│   ├── Inputs
│   └── Icons
├── Molecules (Simple combinations)
│   ├── Form Fields
│   ├── Navigation Items
│   └── Cards
├── Organisms (Complex components)
│   ├── Header
│   ├── Footer
│   └── Project Grid
└── Templates (Page layouts)
    ├── Home Template
    ├── Portfolio Template
    └── Contact Template
```

## 🔄 Design Workflow

### 1. Research & Planning
- **User research**: Understand target audience
- **Competitive analysis**: Study similar portfolios
- **Content audit**: Organize portfolio content
- **Information architecture**: Plan site structure

### 2. Wireframing
- **Low-fidelity sketches**: Quick layout ideas
- **Digital wireframes**: Basic structure and content
- **User flow mapping**: Navigation and interactions
- **Feedback collection**: Stakeholder review

### 3. Visual Design
- **Mood boards**: Visual inspiration and direction
- **Color palette**: Define brand colors
- **Typography**: Choose and scale fonts
- **Component design**: Create reusable elements

### 4. Prototyping
- **Interactive prototypes**: Clickable mockups
- **User testing**: Validate design decisions
- **Iteration**: Refine based on feedback
- **Finalization**: Prepare for development

### 5. Handoff
- **Design specs**: Detailed measurements and styles
- **Asset export**: Icons, images, and graphics
- **Documentation**: Design system and guidelines
- **Developer collaboration**: Support during implementation

### Design Tools
```
Primary: Figma
Supporting: Adobe Creative Suite, Sketch
Prototyping: Figma, InVision
Collaboration: Figma, Miro
```

### Version Control
```
File naming: YYYY-MM-DD_ProjectName_Version
Backup: Cloud storage and version history
Collaboration: Shared Figma files with proper permissions
```

## 📊 Design Metrics

### Performance Goals
```
Page Load Time: < 3 seconds
First Contentful Paint: < 1.5 seconds
Largest Contentful Paint: < 2.5 seconds
Cumulative Layout Shift: < 0.1
```

### Accessibility Goals
```
WCAG Compliance: AA level
Color Contrast: 4.5:1 minimum
Keyboard Navigation: 100% accessible
Screen Reader: Fully compatible
```

### User Experience Goals
```
Mobile Usability: 95+ Lighthouse score
Desktop Performance: 95+ Lighthouse score
Accessibility Score: 95+ Lighthouse score
SEO Score: 95+ Lighthouse score
```

## 🎯 Design Principles

### Visual Hierarchy
1. **Primary elements**: Clear focal points
2. **Secondary elements**: Supporting information
3. **Tertiary elements**: Additional details
4. **Consistent spacing**: Proper visual breathing room

### Content Strategy
- **Scannable**: Easy to read and navigate
- **Actionable**: Clear calls to action
- **Personal**: Reflects individual personality
- **Professional**: Maintains credibility

### Brand Expression
- **Consistent**: Unified visual language
- **Memorable**: Distinctive design elements
- **Scalable**: Works across all touchpoints
- **Authentic**: Reflects true personality

---

**Note**: This design guide should be updated as the project evolves and new design patterns emerge. Regular reviews ensure consistency and alignment with project goals. 