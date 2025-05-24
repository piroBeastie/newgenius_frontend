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

  useEffect(() => {
    if (newsItems.length > 0 && gridRef.current && headerRef.current) {
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
    }
  }, [newsItems]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <FaBars className="text-gray-700" />
              </button>
              <div className="font-bold text-xl text-gray-900">
                News<span className="text-blue-600">Genius</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-gray-100">
                <FaHome className="text-gray-700" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <FaUser className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
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
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium ${
                searchHistory.length >= 10
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : isGeneratingNews
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
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
          
          <div className="flex-1 overflow-y-auto p-6">
            {searchHistory.length > 0 ? (
              <div className="space-y-3">
                {searchHistory.map((item, index) => {
                  // Find if this category is generating
                  const category = userCategories.find(cat => cat.prompt === item);
                  const isGenerating = category?.isGenerating || false;
                  
                  return (
                    <div
                      key={index}
                      className={`w-full p-4 rounded-lg flex items-center group ${
                        item === currentQuery 
                          ? 'bg-blue-100 border border-blue-300 text-blue-800' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <button
                        onClick={() => !isGenerating && handleFollowingPageClick(item)}
                        disabled={isGenerating}
                        className="flex items-center flex-1 min-w-0"
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
    
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to remove "${item}" from your following list?`)) {
      handleDeletePage(item);
    }
  }}
  disabled={isGenerating}
  className={`ml-2 p-2 rounded-lg hover:bg-red-100 text-red-600 transition-all duration-200 ${
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
              <p className="text-sm text-gray-500">NewsGenius v1.0</p>
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
              
              {/* Articles Display */}
              {!isGeneratingNews && !isLoadingNews && newsItems.length > 0 && (
                <div ref={gridRef} className="max-w-4xl mx-auto space-y-6">
                  {newsItems.map((item, index) => (
                    <div key={item.id || index} className="gsap-fade-in">
                      <div 
                        className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-300"
                        onClick={() => handleCardClick(item)}
                      >
                        <div className="flex">
                          {item.imageUrl && (
                            <div className="w-64 h-40 flex-shrink-0">
                              <img
                                src={item.imageUrl}
                                alt={item.mainTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => { 
                                  e.target.onerror = null; 
                                  e.target.src = 'https://placehold.co/256x160/cccccc/333333?text=No+Image'; 
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 p-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {item.mainSource}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                            
                            <h3 className="font-bold text-lg mb-2 text-gray-900">
                              {item.mainTitle}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-3">
                              {item.summaries && item.summaries[0] ? 
                                item.summaries[0].summary.substring(0, 150) + '...' :
                                'No summary available'
                              }
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-blue-600 text-sm font-medium">
                                Read more →
                              </span>
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
