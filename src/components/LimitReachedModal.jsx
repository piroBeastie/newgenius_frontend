import { useRef } from 'react';
import { FaTimes, FaBookmark, FaTrash } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

// Register the hook
gsap.registerPlugin(useGSAP);

function LimitReachedModal({ isOpen, onClose, searchHistory, onRemovePage, newSearchQuery }) {
  const modalRef = useRef(null);
  const timelineRef = useRef(null);

  useGSAP(() => {
    if (!modalRef.current) return;

    timelineRef.current = gsap.timeline({ paused: true });

    timelineRef.current
      .set('.modal-backdrop', { opacity: 0 })
      .set('.modal-content', { opacity: 0, scale: 0.9, y: 20 })
      .to('.modal-backdrop', { 
        opacity: 1, 
        duration: 0.3,
        ease: "power2.out"
      })
      .to('.modal-content', { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.3, 
        ease: "power2.out" 
      }, "-=0.1");

  }, { scope: modalRef, dependencies: [] });

  // Animate in when modal opens
  useGSAP(() => {
    if (isOpen && timelineRef.current) {
      timelineRef.current.play();
    }
  }, { dependencies: [isOpen] });

  const handleClose = () => {
    if (timelineRef.current) {
      // Reverse animation for smooth close
      timelineRef.current.reverse().then(() => {
        onClose();
      });
    } else {
      onClose();
    }
  };

  const handleRemove = (pageToRemove) => {
    onRemovePage(pageToRemove);
    handleClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      <div className="modal-content relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <FaBookmark className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Following Pages Full</h3>
                <p className="text-sm text-gray-500">Remove a page to add "{newSearchQuery}"</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            You can follow up to 10 pages. Choose a page to remove:
          </p>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchHistory.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 font-bold text-xs">{index + 1}</span>
                  </div>
                  <span className="text-gray-700 font-medium truncate">{item}</span>
                </div>
                <button
                  onClick={() => handleRemove(item)}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 ml-2"
                  title="Remove this page"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LimitReachedModal;
