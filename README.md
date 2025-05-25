# NewsGenius Frontend 🎨

**AI-Powered News Aggregation Interface**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://newgenius-frontend.vercel.app/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.0-blue)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.0-green)](https://greensock.com/gsap/)

Modern React frontend for NewsGenius - an intelligent news aggregation platform that provides personalized news feeds with AI-enhanced summaries and real image prioritization.

## 🌟 Live Application

**🔗 [Visit NewsGenius Live](https://newgenius-frontend.vercel.app/)**

## ✨ Features

### 🎯 Core UI Features
- **⚛️ Modern React Interface** - Built with React 18 and modern hooks
- **🎭 GSAP Animations** - Smooth entrance animations and micro-interactions
- **📱 Responsive Design** - Mobile-first design with Tailwind CSS
- **🔐 Google Authentication** - Secure OAuth2 login integration
- **🎯 Side Navigation** - Animated drawer with following pages management
- **📖 Enhanced Modals** - Article viewing with multiple source summaries

### 🎨 Visual Design
- **🎪 Interactive UI** - Hover effects, loading states, and visual feedback
- **🌊 Smooth Transitions** - GSAP-powered animations throughout
- **🎨 Clean Typography** - Optimized readability with custom font sizing
- **🎯 Visual Hierarchy** - Clear information architecture

## 🏗️ Architecture

src/
├── components/ # Reusable UI components
│ ├── SideDrawer.jsx # Animated navigation drawer
│ └── HeroSearchSection.jsx
├── pages/ # Page components
│ ├── Landing.jsx # Landing page with auth
│ └── NewsResultsPage.jsx # News display page
├── context/ # React context providers
│ └── AuthContext.jsx # Authentication state
├── services/ # API service layer
│ └── api.js # Backend communication
└── styles/ # Tailwind configuration

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

Clone the frontend repository
git clone https://github.com/yourusername/newsgenius-frontend.git
cd newsgenius-frontend

Install dependencies
npm install

Create environment file
cp .env.example .env.local

### Environment Variables

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=https://newsgenius-backend.onrender.com/api

### Development

Start development server
npm run dev

Build for production
npm run build

Preview production build
npm run preview


## 🛠️ Tech Stack

- **⚛️ React 18** - Modern React with concurrent features
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🎭 GSAP** - High-performance animations
- **🛣️ React Router** - Client-side routing
- **🔥 Firebase Auth** - Google OAuth2 authentication
- **⚡ Vite** - Fast build tool and development server

## 🎯 Key Components

### Landing Page
- **Synchronized animations** for left/right content
- **Interactive slideshow** with navigation controls
- **Google authentication** integration
- **Feature showcase** with staggered animations

### News Results Page
- **Vertical card layout** with real image priority
- **Following pages sidebar** with GSAP animations
- **Modal system** for detailed article viewing
- **Loading states** and error handling

### Side Drawer
- **Smooth slide animations** with backdrop blur
- **Context-based cleanup** for performance
- **Interactive hover effects** on list items
- **Optimized for mobile** touch interactions

## 📡 API Integration

// Example API usage
import ApiService from './services/api';

// Create new category
const response = await ApiService.createCategory(userId, {
prompt: 'artificial intelligence'
});

// Get category news
const news = await ApiService.getCategoryNews(userId, categoryId);


## 🎨 Animation System

### GSAP Implementation

// Example animation context
useEffect(() => {
const ctx = gsap.context(() => {
const timeline = gsap.timeline();

timeline
  .to(titleRef.current, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
  })
  .to(contentRef.current, {
    opacity: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.2
  }, "-=0.5");
}, containerRef);

return () => ctx.revert(); // Cleanup
}, []);

## 🚀 Deployment
### Vercel Deployment

Install Vercel CLI
npm i -g vercel

Deploy to Vercel
vercel --prod

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: `18.x`

**🎨 Frontend for the future of news consumption**

*Built with React, Tailwind CSS, and GSAP*
