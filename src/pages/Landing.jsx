import { useState, useEffect } from 'react';
import { FaGoogle, FaChevronLeft, FaChevronRight, FaNewspaper, FaSearch, FaBolt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { login, isAuthLoading } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const screenshots = [
    {
      id: 1,
      title: "Smart News Search",
      image: "https://picsum.photos/600/400?random=1",
      description: "Search across multiple news sources instantly"
    },
    {
      id: 2,
      title: "AI-Powered Summaries",
      image: "https://picsum.photos/600/400?random=2", 
      description: "Get concise summaries from multiple perspectives"
    },
    {
      id: 3,
      title: "Real-time Results",
      image: "https://picsum.photos/600/400?random=3",
      description: "Stay updated with the latest breaking news"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [screenshots.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const handleGoogleLogin = async () => {
    const result = await login();
    if (!result.success) {
      alert('Login failed: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="h-screen flex">
        <div className="w-1/2 flex flex-col justify-center px-8 lg:px-16">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">NewsGenius</h1>
              <p className="text-xl text-gray-600">AI-powered news intelligence</p>
            </div>

            <div className="mb-8">
              <button 
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className={`w-full flex items-center justify-center px-6 py-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-lg ${
                  isAuthLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAuthLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin mr-3"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaGoogle className="mr-3 text-red-500 text-xl" />
                    Sign in with Google
                  </>
                )}
              </button>
              
              {!isAuthLoading && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Secure authentication with your Google account
                </p>
              )}
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Sign in to access personalized news feeds and save your preferences
              </p>
            </div>
          </div>
        </div>

        {/* Rest of your slideshow code stays the same */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="relative w-full max-w-2xl">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-[500px] lg:h-[600px]">
                {screenshots.map((screenshot, index) => (
                  <div
                    key={screenshot.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={screenshot.image}
                      alt={screenshot.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {screenshot.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {screenshot.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <FaChevronRight />
              </button>
            </div>

            <div className="flex justify-center space-x-2 mt-6">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide 
                      ? 'bg-gray-800 scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your landing page content stays the same */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Discover News Like Never Before
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              NewsGenius revolutionizes how you consume news by aggregating stories from multiple sources 
              and providing AI-powered summaries, giving you comprehensive perspectives on every story.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-gray-800 text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find relevant news across multiple trusted sources instantly. Our AI-powered search 
                understands context and delivers the most relevant results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaNewspaper className="text-gray-800 text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Multi-Source Summaries</h3>
              <p className="text-gray-600 leading-relaxed">
                Get comprehensive viewpoints from different news outlets. Compare perspectives 
                and understand the full story from multiple angles.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBolt className="text-gray-800 text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay informed with the latest breaking news and developments. Our platform 
                continuously monitors news sources for the most current information.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose NewsGenius?
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Unbiased Coverage</h4>
                <p className="text-gray-600">
                  We aggregate news from diverse sources to provide balanced perspectives on every story.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Time-Saving</h4>
                <p className="text-gray-600">
                  Get the essence of multiple articles in seconds with our AI-generated summaries.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Personalized</h4>
                <p className="text-gray-600">
                  Customize your news feed based on your interests and reading preferences.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Always Updated</h4>
                <p className="text-gray-600">
                  Our platform works 24/7 to bring you the latest news as it happens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
