import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import { 
  FaTimes, 
  FaExternalLinkAlt, 
  FaCalendarAlt, 
  FaNewspaper, 
  FaHome, 
  FaBookmark, 
  FaBars, 
  FaUser, 
  FaPlus, 
  FaExclamationTriangle, 
  FaTrash,
  FaSpinner,
  FaRobot
} from 'react-icons/fa';

function NewsResultsPage({ searchHistory, onSearch, onDeletePage, userCategories }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [newsItems, setNewsItems] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(query);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [isGeneratingNews, setIsGeneratingNews] = useState(false);
  
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const modalRef = useRef(null);
  const rightSideRef = useRef(null);
  const sidebarRef = useRef(null);
  const followingListRef = useRef(null);

  // Load news when query changes or userCategories update
  useEffect(() => {
    const loadNewsForQuery = async () => {
      if (!query || !user || !userCategories.length) return;
      
      console.log('Loading news for query:', query);
      console.log('Available categories:', userCategories);
      
      const category = userCategories.find(cat => cat.prompt === query);
      if (!category) {
        console.log('No category found for query:', query);
        return;
      }
      
      console.log('Found category:', category);
      setIsLoadingNews(true);
      
      try {
        const response = await ApiService.getCategoryNews(user.uid, category.id);
        console.log('News response:', response);
        
        if (response && response.newsItems) {
          setNewsItems(response.newsItems);
          console.log('Set news items:', response.newsItems);
        } else {
          console.log('No news items in response');
          setNewsItems([]);
        }
      } catch (error) {
        console.error('Failed to load news:', error);
        setNewsItems([]);
      } finally {
        setIsLoadingNews(false);
      }
    };

    loadNewsForQuery();
  }, [query, user, userCategories]);

  // Update current query when URL changes
  useEffect(() => {
    if (query) {
      setCurrentQuery(query);
    }
  }, [query]);

  // GSAP optimization for following list
  useEffect(() => {
    if (followingListRef.current && searchHistory.length > 0) {
      const ctx = gsap.context(() => {
        const listItems = followingListRef.current.children;
        
        // Animate list items with stagger
        gsap.fromTo(listItems, 
          { 
            opacity: 0, 
            x: -30, 
            scale: 0.95 
          },
          { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            duration: 0.5, 
            ease: "power2.out", 
            stagger: 0.08
          }
        );

        // Add hover animations for each item
        Array.from(listItems).forEach((item, index) => {
          const button = item.querySelector('.following-item-button');
          const deleteBtn = item.querySelector('.delete-button');
          
          if (button) {
            button.addEventListener('mouseenter', () => {
              gsap.to(item, {
                x: 5,
                scale: 1.02,
                duration: 0.2,
                ease: "power2.out"
              });
            });
            
            button.addEventListener('mouseleave', () => {
              gsap.to(item, {
                x: 0,
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
              });
            });
          }

          if (deleteBtn) {
            deleteBtn.addEventListener('mouseenter', () => {
              gsap.to(deleteBtn, {
                scale: 1.1,
                rotation: 5,
                duration: 0.2,
                ease: "power2.out"
              });
            });
            
            deleteBtn.addEventListener('mouseleave', () => {
              gsap.to(deleteBtn, {
                scale: 1,
                rotation: 0,
                duration: 0.2,
                ease: "power2.out"
              });
            });
          }
        });

      }, followingListRef);

      return () => ctx.revert(); // Cleanup
    }
  }, [searchHistory]);

  // GSAP optimization for news cards
  useEffect(() => {
    if (newsItems.length > 0 && gridRef.current && headerRef.current) {
      const ctx = gsap.context(() => {
        const cards = gridRef.current.children;
        const tl = gsap.timeline();
        
        tl.fromTo(headerRef.current, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        )
        .fromTo(cards, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 }, 
          "-=0.3"
        );
      }, gridRef);

      return () => ctx.revert(); // Cleanup
    }
  }, [newsItems]);

  const handleCardClick = (newsItem) => {
    setSelectedCard(newsItem);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedCard(null);
    document.body.style.overflow = 'unset';
  };

  const handleFollowingPageClick = (item) => {
    console.log('Clicking on following page:', item);
    setSearchParams({ q: item });
  };

  const handleDeletePage = (pageToDelete) => {
    if (pageToDelete === currentQuery) {
      const remainingPages = searchHistory.filter(item => item !== pageToDelete);
      if (remainingPages.length > 0) {
        setSearchParams({ q: remainingPages[0] });
      } else {
        navigate('/');
      }
    }
    onDeletePage(pageToDelete);
  };

  const handleAddPage = async (newQuery) => {
    console.log('Adding new page:', newQuery);
    setIsGeneratingNews(true);
    
    try {
      const canSearch = await onSearch(newQuery);
      if (canSearch) {
        setSearchParams({ q: newQuery });
      }
    } catch (error) {
      console.error('Error adding page:', error);
    } finally {
      setIsGeneratingNews(false);
    }
    
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Enhanced Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Left */}
            <div className="flex items-center">
              <div className="font-bold text-2xl text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200">
                News<span className="text-blue-600">Genius</span>
              </div>
            </div>
            
            {/* Home Button - Right */}
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
              >
                <FaHome className="text-sm" />
                <span className="font-medium">Home</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Enhanced Sidebar with GSAP */}
        <div ref={sidebarRef} className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaBookmark className="text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Following Pages</h2>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {searchHistory.length}/10
              </span>
            </div>
            
            <button
              onClick={() => {
                if (searchHistory.length < 10) {
                  setShowAddModal(true);
                }
              }}
              disabled={isGeneratingNews}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                searchHistory.length >= 10
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : isGeneratingNews
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-sm'
              }`}
            >
              {isGeneratingNews ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : searchHistory.length >= 10 ? (
                <>
                  <FaExclamationTriangle className="mr-2" />
                  Limit Reached
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Add New Page
                </>
              )}
            </button>
          </div>
          
          {/* Enhanced Following List with GSAP */}
          <div className="flex-1 overflow-y-auto p-6">
            {searchHistory.length > 0 ? (
              <div ref={followingListRef} className="space-y-3">
                {searchHistory.map((item, index) => {
                  const category = userCategories.find(cat => cat.prompt === item);
                  const isGenerating = category?.isGenerating || false;
                  
                  return (
                    <div
                      key={index}
                      className={`w-full p-4 rounded-lg flex items-center group transition-all duration-300 ${
                        item === currentQuery 
                          ? 'bg-blue-100 border border-blue-300 text-blue-800 shadow-md' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                      }`}
                    >
                      <button
                        onClick={() => !isGenerating && handleFollowingPageClick(item)}
                        disabled={isGenerating}
                        className="following-item-button flex items-center flex-1 min-w-0"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          {isGenerating ? (
                            <FaSpinner className="text-blue-600 text-xs animate-spin" />
                          ) : (
                            <span className="text-blue-600 font-bold text-xs">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="truncate block font-medium">{item}</span>
                          <span className="text-xs text-gray-500">
                            {isGenerating ? 'Generating articles...' : 'Real news from backend'}
                          </span>
                        </div>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          console.log('Delete button clicked for:', item);
                          
                          if (window.confirm(`Are you sure you want to remove "${item}" from your following list?`)) {
                            handleDeletePage(item);
                          }
                        }}
                        disabled={isGenerating}
                        className={`delete-button ml-2 p-2 rounded-lg hover:bg-red-100 text-red-600 transition-all duration-200 ${
                          isGenerating ? 'opacity-30 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
                        }`}
                        title="Remove this page"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaBookmark className="text-gray-300 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No pages followed yet</p>
                <p className="text-gray-400 text-xs mt-1">Click "Add New Page" to start</p>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-500">NewsGenius v0.5 beta</p>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-6">
            <div ref={headerRef}>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Results</h1>
              <p className="text-lg text-gray-600">
                Results for: "<span className="font-semibold text-gray-800">{query}</span>" 
                <span className="text-blue-600 ml-2">({newsItems.length} articles)</span>
              </p>
            </div>
          </div>

          <div ref={rightSideRef} className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6">
              {/* Generation Loading State */}
              {isGeneratingNews && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <FaRobot className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Generating Articles</h3>
                  <p className="text-gray-500 mb-4">AI is fetching and processing real news...</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}
              
              {/* Regular Loading State */}
              {!isGeneratingNews && isLoadingNews && (
                <div className="text-center py-20">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading articles...</p>
                </div>
              )}
              
              {/* Enhanced Vertical Articles Display - NEW LAYOUT */}
              {!isGeneratingNews && !isLoadingNews && newsItems.length > 0 && (
                <div ref={gridRef} className="max-w-3xl mx-auto space-y-8">
                  {newsItems.map((item, index) => (
                    <div key={item.id || index} className="gsap-fade-in">
                      <div 
                        className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-300"
                        onClick={() => handleCardClick(item)}
                      >
                        <div className="flex h-56">
                          {item.imageUrl && (
                            <div className="w-72 flex-shrink-0">
                              <img
                                src={item.imageUrl}
                                alt={item.mainTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => { 
                                  e.target.onerror = null; 
                                  e.target.src = 'https://placehold.co/288x224/cccccc/333333?text=No+Image'; 
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 p-8 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                  {item.mainSource}
                                </span>
                                <span className="text-gray-500 text-sm flex items-center">
                                  <FaCalendarAlt className="mr-2" />
                                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Recent'}
                                </span>
                              </div>
                              
                              <h3 className="font-bold text-xl mb-4 text-gray-900 leading-tight">
                                {item.mainTitle}
                              </h3>
                              
                              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">
                                {item.summaries && item.summaries[0] ? 
                                  item.summaries[0].summary :
                                  'No summary available'
                                }
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <span className="text-blue-600 text-sm font-medium flex items-center">
                                Read more 
                                <FaExternalLinkAlt className="ml-2 text-xs" />
                              </span>
                              <div className="flex items-center space-x-4">
                                {item.summaries && (
                                  <span className="text-gray-400 text-xs">
                                    {item.summaries.length} sources
                                  </span>
                                )}
                                {item.hasRealImage && (
                                  <span className="text-green-600 text-xs font-medium">
                                    ✅ Real Image
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* No Articles State */}
              {!isGeneratingNews && !isLoadingNews && newsItems.length === 0 && query && (
                <div className="text-center py-20">
                  <FaNewspaper className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                  <p className="text-gray-500 mb-6">Try refreshing or check back later</p>
                </div>
              )}
              
              {/* Select Topic State */}
              {!isGeneratingNews && !isLoadingNews && !query && (
                <div className="text-center py-20">
                  <FaNewspaper className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a topic</h3>
                  <p className="text-gray-500 mb-6">Choose a topic from your following list to view articles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Add New Page</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const query = formData.get('query');
              if (query.trim()) {
                handleAddPage(query.trim());
                e.target.reset();
              }
            }} className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Topic
              </label>
              <input
                name="query"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter news topic..."
                autoFocus
              />
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingNews}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isGeneratingNews ? 'Generating...' : 'Add Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {selectedCard && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">News Article</h3>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100">
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {selectedCard.imageUrl && (
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.mainTitle}
                  className="w-full h-64 object-cover"
                />
              )}
              
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedCard.mainTitle}
                </h1>
                
                <div className="flex items-center gap-4 mb-6 text-gray-600">
                  <span>{selectedCard.mainSource}</span>
                  <span>{selectedCard.publishedAt ? new Date(selectedCard.publishedAt).toLocaleDateString() : 'Recent'}</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Article Summaries ({selectedCard.summaries?.length || 0})
                  </h2>
                  
                  {selectedCard.summaries?.map((summary, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {idx + 1}. {summary.source}
                      </h3>
                      <p className="text-gray-700 mb-3">{summary.summary}</p>
                      {summary.url && (
                        <a 
                          href={summary.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                        >
                          <span>Read Original</span>
                          <FaExternalLinkAlt className="text-xs" />
                        </a>
                      )}
                    </div>
                  )) || (
                    <p className="text-gray-500">No summaries available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsResultsPage;
