import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCheckCircle, FaClock } from 'react-icons/fa';
import { gsap } from 'gsap';

function HeroSearchSection({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Animation refs for GSAP
  const heroContainerRef = useRef(null);
  const brandTitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const searchInputRef = useRef(null);
  const quickSuggestionsRef = useRef(null);
  const featuresGridRef = useRef(null);

  useEffect(() => {
    const animationContext = gsap.context(() => {
      const entranceTimeline = gsap.timeline();

      // Set initial animation states
      gsap.set([
        brandTitleRef.current,
        descriptionRef.current,
        searchInputRef.current,
        quickSuggestionsRef.current
      ], {
        opacity: 0,
        y: 50
      });

      gsap.set(featuresGridRef.current?.children || [], {
        opacity: 0,
        y: 30,
        scale: 0.9
      });

      // Staggered entrance animation sequence
      entranceTimeline
        .to(brandTitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        })
        .to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        .to(searchInputRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.4")
        .to(quickSuggestionsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.3")
        .to(featuresGridRef.current?.children || [], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out"
        }, "-=0.2");
    }, heroContainerRef);

    return () => animationContext.revert();
  }, []);

  const executeSearch = () => {
    if (!searchQuery.trim()) return;
    
    const searchAllowed = onSearch(searchQuery);
    if (searchAllowed) {
      navigate(`/news?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const selectSuggestion = (suggestionText) => {
    const normalizedTerm = suggestionText.toLowerCase();
    setSearchQuery(normalizedTerm);
    const searchAllowed = onSearch(normalizedTerm);
    if (searchAllowed) {
      navigate(`/news?q=${encodeURIComponent(normalizedTerm)}`);
    }
  };

  const popularSuggestions = ['AI Healthcare', 'Tesla Stock', 'Cryptocurrency', 'Climate Change'];

  return (
    <div ref={heroContainerRef} className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          ref={brandTitleRef}
          className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          News<span className="text-blue-600">Genius</span>
        </h1>
        
        <p 
          ref={descriptionRef}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Discover news from multiple sources with AI-powered summaries. 
          Get comprehensive perspectives on every story.
        </p>
        
        {/* Search interface */}
        <div ref={searchInputRef} className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-center items-center bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <input 
              type="text" 
              className="px-6 py-4 ml-2 h-14 w-full focus:outline-none rounded-l-full text-lg"
              placeholder="Try: ai healthcare, tesla stock, cryptocurrency"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && executeSearch()}
            />
            <button 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-4 mr-2 flex items-center justify-center text-white w-12 h-12 rounded-full transition-colors duration-200 shadow-md"
              onClick={executeSearch}
            >
              <FaSearch className="text-lg" />
            </button>
          </div>
        </div>
        
        {/* Quick suggestions */}
        <div ref={quickSuggestionsRef} className="flex flex-wrap justify-center gap-3 mb-16">
          {popularSuggestions.map((suggestionItem) => (
            <button
              key={suggestionItem}
              onClick={() => selectSuggestion(suggestionItem)}
              className="px-4 py-2 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              {suggestionItem}
            </button>
          ))}
        </div>
        
        {/* Features showcase */}
        <div ref={featuresGridRef} className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Search</h3>
            <p className="text-gray-600 leading-relaxed">Find relevant news across multiple trusted sources instantly</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Summaries</h3>
            <p className="text-gray-600 leading-relaxed">Get comprehensive viewpoints from different news outlets</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClock className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Updates</h3>
            <p className="text-gray-600 leading-relaxed">Stay informed with the latest breaking news developments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSearchSection;
