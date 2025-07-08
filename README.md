# Personal Portfolio Website

## 🎯 Project Overview

This is a comprehensive personal portfolio website designed to showcase web development skills, data analysis capabilities, and various technical projects. The website serves as a dynamic platform to demonstrate expertise in web development, API integration, data engineering, and design.

## 🚀 Project Goals

1. **Personal Introduction**: Professional self-introduction page
2. **Portfolio Showcase**: Interactive pages for each GitHub project with working web applications
3. **Technology Foundation**: Built primarily with HTML, CSS, and JavaScript
4. **Advanced Features**: Future implementation of PowerBI dashboards, SQL data integration, and payment systems
5. **Professional Design**: Modern, responsive design with Figma mockups
6. **Educational Documentation**: Comprehensive English documentation explaining every decision and code choice

## 🛠 Technology Stack

### Core Technologies
- **HTML5**: Semantic markup for accessibility and SEO
- **CSS3**: Modern styling with Grid, Flexbox, and CSS Variables
- **JavaScript (ES6+)**: Vanilla JS for interactivity and functionality

### Development Tools
- **Vite**: Fast build tool and development server
- **Git**: Version control
- **GitHub Pages**: Deployment platform

### Current Features
- **GitHub API Integration**: Real-time repository data and statistics
- **PowerBI Dashboard**: Interactive analytics dashboard with data visualization
- **Vector Search**: AI-powered image and text similarity search using Azure Computer Vision
- **Responsive Design**: Mobile-first approach with modern CSS
- **Theme System**: Dark/Light mode with automatic detection
- **Contact Form**: Interactive form with validation and submission
- **Performance Optimization**: Lazy loading, caching, and optimized assets

### Future Additions
- **React**: For complex component management
- **Node.js**: Backend API development
- **SQL Server**: Database integration
- **Payment APIs**: E-commerce functionality

## 📁 Project Structure

```
optical_warehouse_web/
├── docs/                    # Project documentation
│   ├── development/        # Development guides
│   ├── design/            # Design specifications
│   └── deployment/        # Deployment guides
├── src/                    # Source code
│   ├── pages/             # Individual pages
│   │   ├── home/          # Home/Introduction page
│   │   ├── portfolio/     # Portfolio projects
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
└── README.md            # This file
```

## 🎨 Design Philosophy

### Visual Design
- **Modern Minimalism**: Clean, professional appearance
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: User preference-based theme switching
- **Interactive Elements**: Hover effects, smooth animations
- **Card-based Layout**: Portfolio projects displayed as interactive cards

### Color Palette
- **Primary**: #2563eb (Professional Blue)
- **Secondary**: #64748b (Neutral Gray)
- **Accent**: #f59e0b (Warm Orange)
- **Background**: #ffffff / #0f172a (Light/Dark themes)
- **Text**: #1e293b / #f8fafc (Dark/Light text)

## 📋 Development Phases

### Phase 1: Foundation Setup (Days 1-2)
- [x] Project structure creation
- [ ] Basic HTML templates
- [ ] CSS foundation and variables
- [ ] Responsive design base
- [ ] Development environment setup

### Phase 2: Core Pages (Days 3-5)
- [ ] Home page with personal introduction
- [ ] Navigation system
- [ ] Responsive layout implementation
- [ ] Basic animations and interactions

### Phase 3: Portfolio Implementation (Days 6-10)
- [ ] Individual project pages
- [ ] Project showcase components
- [ ] Interactive demos
- [ ] Project filtering and search

### Phase 4: Advanced Features (Days 11-17)
- [x] API integrations
- [x] Data visualization components
- [x] Contact form functionality
- [x] Performance optimization
- [x] PowerBI Dashboard integration
- [x] Vector Search integration with Azure Computer Vision

### Phase 5: Deployment & Polish (Days 18-20)
- [ ] SEO optimization
- [ ] Performance testing
- [ ] Cross-browser compatibility
- [ ] Deployment configuration

## 🔍 Vector Search Feature

### Overview
The Vector Search feature is an AI-powered similarity search system that allows users to find similar products using either text queries or image URLs. It leverages Azure Computer Vision's vectorization capabilities to create embeddings and perform cosine similarity searches.

### Features
- **Text Search**: Enter descriptive text (e.g., "robot", "car", "toy") to find similar products
- **Image Search**: Provide image URLs to find visually similar products
- **Real-time Results**: Instant search results with similarity scores
- **Fallback Mode**: Works offline with sample data when API is unavailable

### Technical Implementation
- **Frontend**: Pure HTML/CSS/JavaScript with modern UI design
- **Backend**: Flask API with CORS support
- **AI Service**: Azure Computer Vision API for vectorization
- **Similarity Algorithm**: Cosine similarity for vector comparison

### Setup Instructions
1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Azure credentials** (optional):
   Create a `.env` file with your Azure Computer Vision credentials:
   ```
   AZURE_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com
   AZURE_API_KEY=your-azure-api-key-here
   ```

3. **Start the Streamlit app**:
   ```bash
   python run_streamlit.py
   ```
   Or manually:
   ```bash
   streamlit run streamlit_app.py --server.port 8501
   ```

4. **Access the feature**:
   Navigate to the Vector Search page via the sidebar link
   The Streamlit app will be embedded in an iframe within the page

### Streamlit Integration
- **Iframe Embedding**: Streamlit app is embedded directly in the webpage
- **Seamless Experience**: Users can search without leaving the main website
- **Fallback Support**: Shows helpful error message if Streamlit app is not running
- **Real-time Communication**: JavaScript and Streamlit can communicate via postMessage

### Security Notes
- Azure credentials are stored in `.env` file (not committed to Git)
- API includes error handling and fallback mechanisms
- CORS is enabled for local development

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+ (for Vector Search API)
- Git
- Modern web browser

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd optical_warehouse_web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📚 Learning Resources

This project is designed as a learning experience. Each component and decision is thoroughly documented with:
- **Why**: Explanation of why specific technologies/approaches were chosen
- **How**: Detailed implementation guides
- **Alternatives**: Discussion of other options and why they weren't selected
- **Best Practices**: Industry standards and recommendations

## 🤝 Contributing

This is a personal portfolio project, but suggestions and improvements are welcome through issues and discussions.

## 📄 License

This project is for personal use and portfolio demonstration.

---

**Note**: This project is designed to be educational and comprehensive, serving as both a portfolio showcase and a learning resource for web development best practices. 