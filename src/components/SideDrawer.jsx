import { useRef, useEffect } from 'react';
import { FaTimes, FaBookmark, FaChevronRight } from 'react-icons/fa';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

function SideDrawer({ isOpen, searchHistory, onHistoryItemClick }) {
  const drawerContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const navigationListRef = useRef(null);
  const headerSectionRef = useRef(null);
  const footerSectionRef = useRef(null);
  const navigate = useNavigate();

  const handleOverlayInteraction = (event) => {
    if (event.target === event.currentTarget) {
      onHistoryItemClick();
    }
  };

  const navigateToSelectedPage = (selectedItem) => {
    navigate(`/news?q=${encodeURIComponent(selectedItem)}`);
    onHistoryItemClick();
  };

  // Drawer animation management
  useEffect(() => {
    const animationContext = gsap.context(() => {
      if (isOpen) {
        // Opening animation sequence
        gsap.set(overlayRef.current, { 
          display: 'block', 
          opacity: 0,
          backdropFilter: 'blur(0px)',
          webkitBackdropFilter: 'blur(0px)',
          willChange: 'opacity, backdrop-filter'
        });
        gsap.set(panelRef.current, { 
          x: '-100%',
          willChange: 'transform'
        });
        
        const openTimeline = gsap.timeline({
          defaults: { ease: "power2.out" }
        });
        
        openTimeline
          .to(overlayRef.current, {
            opacity: 1,
            backdropFilter: 'blur(4px)',
            webkitBackdropFilter: 'blur(4px)',
            duration: 0.3
          })
          .to(panelRef.current, {
            x: '0%',
            duration: 0.4,
            ease: "power2.out"
          }, "-=0.2")
          .fromTo([headerSectionRef.current, navigationListRef.current, footerSectionRef.current], {
            opacity: 0,
            x: -20
          }, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.1
          }, "-=0.2")
          .set([overlayRef.current, panelRef.current], {
            willChange: 'auto'
          });
          
      } else {
        // Closing animation sequence
        gsap.set([overlayRef.current, panelRef.current], {
          willChange: 'transform, opacity, backdrop-filter'
        });
        
        const closeTimeline = gsap.timeline();
        
        closeTimeline
          .to([headerSectionRef.current, navigationListRef.current, footerSectionRef.current], {
            opacity: 0,
            x: -30,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in"
          })
          .to(panelRef.current, {
            x: '-100%',
            duration: 0.8,
            ease: "power2.inOut"
          }, "-=0.1")
          .to(overlayRef.current, {
            opacity: 0,
            backdropFilter: 'blur(0px)',
            webkitBackdropFilter: 'blur(0px)',
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(overlayRef.current, { 
                display: 'none',
                willChange: 'auto'
              });
              gsap.set(panelRef.current, {
                willChange: 'auto'
              });
            }
          }, "-=0.2");
      }
    }, drawerContainerRef);

    return () => animationContext.revert();
  }, [isOpen]);

  return (
    <div ref={drawerContainerRef}>
      {/* Background overlay with blur effect */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-40"
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.15)',
          backdropFilter: 'blur(0px)',
          webkitBackdropFilter: 'blur(0px)',
          display: 'none'
        }}
        onClick={handleOverlayInteraction}
      />
      
      {/* Main drawer panel */}
      <div 
        ref={panelRef}
        className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 border-r-2 border-gray-300"
        style={{ transform: 'translateX(-100%)' }}
      >
        <div className="flex flex-col h-full">
          {/* Header section */}
          <div ref={headerSectionRef} className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center">
              <FaBookmark className="text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Following Pages</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                {searchHistory.length}/10
              </span>
              <button 
                onClick={onHistoryItemClick}
                className="p-2 rounded-lg hover:bg-blue-100 transition-colors duration-150"
                aria-label="Close drawer"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Navigation content */}
          <div className="flex-1 overflow-y-auto p-6">
            {searchHistory.length > 0 ? (
              <div ref={navigationListRef} className="space-y-2">
                {searchHistory.map((pageItem, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => navigateToSelectedPage(pageItem)}
                    className="w-full text-left p-4 rounded-lg transition-colors duration-150 flex items-center group hover:bg-blue-50 border border-gray-100"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-bold text-xs">{itemIndex + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="truncate block font-medium text-gray-700">{pageItem}</span>
                      <span className="text-xs text-gray-500">
                        Real news from backend
                      </span>
                    </div>
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <FaChevronRight className="w-4 h-4 text-gray-400" />
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
          
          {/* Footer section */}
          <div ref={footerSectionRef} className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                NewsGenius v0.5 beta
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
