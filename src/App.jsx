import { useState, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth, AuthProvider } from './context/AuthContext';
import { gsap } from 'gsap';

import NavigationBar from './components/NavigationBar';
import SideDrawer from './components/SideDrawer';
import HeroSearchSection from './components/HeroSearchSection';
import LoadingSpinner from './components/LoadingSpinner';
import NewsResultsPage from './pages/NewsResultsPage';
import Landing from './pages/Landing';

function AppContent() {
  const { isUserAuthenticated, isAuthLoading, user, userCategories, addCategory, removeCategory } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasHomePageLoaded, setHasHomePageLoaded] = useState(false);
  
  const homeContainerRef = useRef(null);
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);

  const trendingSearchTerms = [
    "React development", 
    "Tailwind CSS", 
    "Web application architecture", 
    "Frontend frameworks", 
    "JavaScript ES6+"
  ];
  
  const platformUpdates = [
    "New search algorithm", 
    "Mobile responsive design", 
    "Dark mode available", 
    "Performance optimization"
  ];
  
  const sampleResults = [
    "Result 1", 
    "Result 2", 
    "Result 3", 
    "Result 4"
  ];

  const handleUserSearch = async (searchQuery) => {
    if (!user) return false;
    
    console.log('Handling user search:', searchQuery);
    
    const existingCategory = userCategories.find(cat => 
      cat.prompt.toLowerCase() === searchQuery.toLowerCase()
    );
    
    if (existingCategory && !existingCategory.isGenerating) {
      console.log('Category already exists:', existingCategory);
      return true;
    }
    
    if (userCategories.filter(cat => !cat.isGenerating).length >= 10) {
      console.log('Category limit reached');
      return false;
    }
    
    console.log('Adding new category...');
    const result = await addCategory(searchQuery);
    console.log('Add category result:', result);
    
    return result.success;
  };

  // FIXED: This function now properly calls removeCategory with the prompt
  const handleDeletePage = async (categoryPrompt) => {
    console.log('App.jsx - handleDeletePage called with:', categoryPrompt);
    
    try {
      const result = await removeCategory(categoryPrompt); // Pass prompt, not ID
      
      if (result.success) {
        console.log('Category deleted successfully');
      } else {
        console.error('Delete failed:', result.error);
        alert('Failed to delete category: ' + result.error);
      }
    } catch (error) {
      console.error('Error in handleDeletePage:', error);
      alert('Error deleting category');
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(prevState => !prevState);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (isUserAuthenticated && homeContainerRef.current && !hasHomePageLoaded) {
      const animationTimer = setTimeout(() => {
        const elementsToAnimate = [navRef.current, heroRef.current, contentRef.current, footerRef.current];
        
        if (elementsToAnimate.every(element => element !== null)) {
          const timeline = gsap.timeline();
          
          timeline.fromTo(navRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          .fromTo(heroRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 
            "-=0.3"
          )
          .fromTo(contentRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 
            "-=0.3"
          )
          .fromTo(footerRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 
            "-=0.3"
          );
          
          setHasHomePageLoaded(true);
        } else {
          elementsToAnimate.forEach(element => {
            if (element) gsap.set(element, { opacity: 1, y: 0 });
          });
          setHasHomePageLoaded(true);
        }
      }, 100);

      return () => clearTimeout(animationTimer);
    }
  }, [isUserAuthenticated, hasHomePageLoaded]);

  useEffect(() => {
    if (!isUserAuthenticated) {
      setHasHomePageLoaded(false);
    }
  }, [isUserAuthenticated]);

  useEffect(() => {
    console.log('Categories updated in App:', userCategories);
  }, [userCategories]);

  if (isAuthLoading) {
    return <LoadingSpinner message="Signing you in..." />;
  }

  const searchHistory = userCategories.map(cat => cat.prompt);

  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <Routes>
            <Route 
              path="/" 
              element={
                isUserAuthenticated ? (
                  <div ref={homeContainerRef}>
                    <div ref={navRef} className="gsap-fade-in">
                      <NavigationBar toggleDrawer={toggleDrawer} />
                    </div>
                    
                    <SideDrawer
                      isOpen={isDrawerOpen}
                      searchHistory={searchHistory}
                      onHistoryItemClick={closeDrawer}
                    />
                    
                    <div ref={heroRef} className="gsap-fade-in">
                      <HeroSearchSection onSearch={handleUserSearch} />
                    </div>
                    
                    <div ref={contentRef} className="gsap-fade-in">
                      <div className="bg-gray-50 py-16">
                        <div className="max-w-7xl mx-auto px-4">
                          <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                              Explore Popular Topics
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              Discover trending searches, latest updates, and popular results
                            </p>
                          </div>
                          <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-red-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-red-100">
                              <h3 className="text-xl font-bold text-gray-900 mb-6">🔥 Top Searches</h3>
                              <ul className="space-y-3">
                                {trendingSearchTerms.map((term, index) => (
                                  <li key={index} className="p-4 bg-white rounded-xl border border-gray-100 text-gray-700 font-medium">
                                    {term}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
                              <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Latest Updates</h3>
                              <ul className="space-y-3">
                                {platformUpdates.map((update, index) => (
                                  <li key={index} className="p-4 bg-white rounded-xl border border-gray-100 text-gray-700 font-medium">
                                    {update}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-green-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100">
                              <h3 className="text-xl font-bold text-gray-900 mb-6">⭐ Popular Results</h3>
                              <ul className="space-y-3">
                                {sampleResults.map((result, index) => (
                                  <li key={index} className="p-4 bg-white rounded-xl border border-gray-100 text-gray-700 font-medium">
                                    {result}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div ref={footerRef} className="gsap-fade-in">
                      <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
                        <div className="max-w-7xl mx-auto px-4">
                          <div className="text-center">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                              News<span className="text-blue-600">Genius</span>
                            </h3>
                            <p className="text-gray-600 mb-4">
                              AI-powered news intelligence platform
                            </p>
                            <p className="text-gray-600">© {new Date().getFullYear()} NewsGenius. All rights reserved.</p>
                          </div>
                        </div>
                      </footer>
                    </div>
                  </div>
                ) : (
                  <Landing />
                )
              } 
            />
            <Route 
              path="/news" 
              element={
                isUserAuthenticated ? (
                  <NewsResultsPage 
                    searchHistory={searchHistory}
                    onSearch={handleUserSearch}
                    onDeletePage={handleDeletePage}
                    userCategories={userCategories}
                  />
                ) : (
                  <Landing />
                )
              } 
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
