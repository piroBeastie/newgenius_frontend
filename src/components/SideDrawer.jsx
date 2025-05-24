import { useRef, useEffect } from 'react';
import { FaTimes, FaBookmark } from 'react-icons/fa';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import newsArticles from '../data/newsDatabase';

function SideDrawer({ isOpen, searchHistory, onHistoryItemClick }) {
  const drawerRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onHistoryItemClick();
    }
  };

  const searchMockData = (searchTerm) => {
    if (!searchTerm) return [];
    
    const lowercaseQuery = searchTerm.toLowerCase();
    
    return newsArticles.filter(article => 
      article.mainTitle.toLowerCase().includes(lowercaseQuery) ||
      article.summaries.some(summary => 
        summary.summary.toLowerCase().includes(lowercaseQuery)
      )
    );
  };

  const handleFollowingPageClick = (item) => {
    navigate(`/news?q=${encodeURIComponent(item)}`);
    onHistoryItemClick();
  };

  useEffect(() => {
    if (isOpen) {
      // Show and animate in
      gsap.set(backdropRef.current, { display: 'block', opacity: 0 });
      gsap.set(contentRef.current, { x: '-100%' });
      
      const timeline = gsap.timeline();
      timeline
        .to(backdropRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(contentRef.current, {
          x: '0%',
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.1");
        
    } else {
      // Animate out and hide
      const timeline = gsap.timeline();
      timeline
        .to(contentRef.current, {
          x: '-100%',
          duration: 0.3,
          ease: "power2.in"
        })
        .to(backdropRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(backdropRef.current, { display: 'none' });
          }
        }, "-=0.1");
    }
  }, [isOpen]);

  return (
    <div ref={drawerRef}>
      <div 
        ref={backdropRef}
        className="fixed inset-0 z-40"
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.15)',
          backdropFilter: 'blur(4px)',
          display: 'none'
        }}
        onClick={handleBackdropClick}
      />
      
      <div 
        ref={contentRef}
        className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50"
        style={{ transform: 'translateX(-100%)' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaBookmark className="text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Following Pages</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {searchHistory.length}/10
              </span>
              <button 
                onClick={onHistoryItemClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {searchHistory.length > 0 ? (
              <div className="space-y-2">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleFollowingPageClick(item)}
                    className="w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center group hover:bg-gray-100 hover:shadow-sm"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-bold text-xs">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="truncate block font-medium text-gray-700">{item}</span>
                      <span className="text-xs text-gray-500">
                        {searchMockData(item).length} articles
                      </span>
                    </div>
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaBookmark className="text-gray-300 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No pages followed yet</p>
                <p className="text-gray-400 text-xs mt-1">Search for topics to start following pages</p>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                NewsGenius v1.0
              </p>
              <p className="text-xs text-gray-400">
                Following up to 10 pages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideDrawer;
