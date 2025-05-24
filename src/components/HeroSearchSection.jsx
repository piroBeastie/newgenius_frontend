import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

function HeroSearchSection({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    
    const canSearch = onSearch(query);
    if (canSearch) {
      navigate(`/news?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchTerm = suggestion.toLowerCase();
    setQuery(searchTerm);
    const canSearch = onSearch(searchTerm);
    if (canSearch) {
      navigate(`/news?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          News<span className="text-blue-600">Genius</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover news from multiple sources with AI-powered summaries. 
          Get comprehensive perspectives on every story.
        </p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-center items-center bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <input 
              type="text" 
              className="px-6 py-4 ml-2 h-14 w-full focus:outline-none rounded-l-full text-lg"
              placeholder="Try: ai healthcare, tesla stock, cryptocurrency"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-4 mr-2 flex items-center justify-center text-white w-12 h-12 rounded-full transition-colors duration-200 shadow-md"
              onClick={handleSearch}
            >
              <FaSearch className="text-lg" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['AI Healthcare', 'Tesla Stock', 'Cryptocurrency', 'Climate Change'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Search</h3>
            <p className="text-gray-600 leading-relaxed">Find relevant news across multiple trusted sources instantly</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Summaries</h3>
            <p className="text-gray-600 leading-relaxed">Get comprehensive viewpoints from different news outlets</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
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
