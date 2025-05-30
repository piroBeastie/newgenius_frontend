import { useState, useEffect, useRef } from 'react';
import { FaGoogle, FaChevronLeft, FaChevronRight, FaNewspaper, FaSearch, FaBolt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';

// Import your local images
import ss1 from '../assets/images/ss1.png';
import ss2 from '../assets/images/ss2.png';
import ss3 from '../assets/images/ss3.png';

function Landing() {
  const { login, isAuthLoading } = useAuth();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Animation refs for GSAP
  const landingContainerRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const titleElementRef = useRef(null);
  const subtitleElementRef = useRef(null);
  const loginButtonRef = useRef(null);
  const descriptionTextRef = useRef(null);
  const slideshowContainerRef = useRef(null);
  const featuresGridRef = useRef(null);
  const benefitsSectionRef = useRef(null);

  // Demo content for slideshow with local images - no text overlays
  const demoScreenshots = [
    {
      id: 'screenshot-1',
      image: ss1
    },
    {
      id: 'screenshot-2',
      image: ss2
    },
    {
      id: 'screenshot-3',
      image: ss3
    }
  ];

  // GSAP entrance animations
  useEffect(() => {
    const animationContext = gsap.context(() => {
      const mainTimeline = gsap.timeline();

      // Initial state setup
      gsap.set([
        titleElementRef.current,
        subtitleElementRef.current,
        loginButtonRef.current,
        descriptionTextRef.current
      ], {
        opacity: 0,
        x: -50
      });

      gsap.set(slideshowContainerRef.current, {
        opacity: 0,
        x: 50
      });

      gsap.set(featuresGridRef.current?.children || [], {
        opacity: 0,
        y: 30,
        scale: 0.95
      });

      gsap.set(benefitsSectionRef.current, {
        opacity: 0,
        y: 40
      });

      // Synchronized entrance animation
      mainTimeline
        .to(titleElementRef.current, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out"
        })
        .to(slideshowContainerRef.current, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out"
        }, "<") // Start simultaneously with title
        .to(subtitleElementRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        .to(loginButtonRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.4")
        .to(descriptionTextRef.current, {
          opacity: 1,
          x: 0,
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
        }, "-=0.2")
        .to(benefitsSectionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.2");
    }, landingContainerRef);

    return () => animationContext.revert();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % demoScreenshots.length);
    }, 4000);
    
    return () => clearInterval(slideTimer);
  }, [demoScreenshots.length]);

  const advanceToNextSlide = () => {
    setActiveSlideIndex((currentIndex) => (currentIndex + 1) % demoScreenshots.length);
  };

  const goToPreviousSlide = () => {
    setActiveSlideIndex((currentIndex) => 
      (currentIndex - 1 + demoScreenshots.length) % demoScreenshots.length
    );
  };

  const initiateGoogleAuth = async () => {
    const authResult = await login();
    if (!authResult.success) {
      alert('Authentication failed: ' + authResult.error);
    }
  };

  return (
    <div ref={landingContainerRef} className="min-h-screen bg-gradient-to-br from-blue-50/20 via-white to-blue-50/10">
      {/* Main hero section */}
      <div className="h-screen flex">
        {/* Authentication section - Just add subtle background */}
        <div ref={leftContentRef} className="w-1/2 flex flex-col justify-center px-8 lg:px-16 bg-blue-50/10">
          <div className="w-full max-w-md mx-auto">
            {/* Brand identity */}
            <div ref={titleElementRef} className="mb-8 text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                News<span className="text-blue-600">Genius</span>
              </h1>
              <p ref={subtitleElementRef} className="text-xl text-gray-600">AI-powered news intelligence</p>
            </div>

            {/* Authentication button */}
            <div ref={loginButtonRef} className="mb-8">
              <button 
                onClick={initiateGoogleAuth}
                disabled={isAuthLoading}
                className={`w-full flex items-center justify-center px-6 py-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-lg ${
                  isAuthLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAuthLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin mr-3"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <FaGoogle className="mr-3 text-red-500 text-xl" />
                    Continue with Google
                  </>
                )}
              </button>
              
              {!isAuthLoading && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Secure authentication powered by Google
                </p>
              )}
            </div>

            {/* User guidance */}
            <div ref={descriptionTextRef} className="text-center">
              <p className="text-gray-500 text-sm">
                Access personalized news feeds and customize your reading experience
              </p>
            </div>
          </div>
        </div>

        {/* Interactive slideshow - Clean images only */}
        <div ref={rightContentRef} className="w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div ref={slideshowContainerRef} className="relative w-full max-w-2xl">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-[500px] lg:h-[600px]">
                {demoScreenshots.map((screenshot, slideIndex) => (
                  <div
                    key={screenshot.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      slideIndex === activeSlideIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={screenshot.image}
                      alt={`Screenshot ${slideIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation controls */}
              <button
                onClick={goToPreviousSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                aria-label="Previous slide"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={advanceToNextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                aria-label="Next slide"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {demoScreenshots.map((_, indicatorIndex) => (
                <button
                  key={indicatorIndex}
                  onClick={() => setActiveSlideIndex(indicatorIndex)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    indicatorIndex === activeSlideIndex 
                      ? 'bg-gray-800 scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${indicatorIndex + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features showcase */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Transform Your News Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              NewsGenius revolutionizes information consumption by aggregating content from multiple sources 
              and providing AI-enhanced summaries for comprehensive understanding.
            </p>
          </div>

          <div ref={featuresGridRef} className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-gray-800 text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Intelligent Discovery</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced search algorithms understand context and deliver precisely relevant results 
                from verified news sources worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaNewspaper className="text-gray-800 text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Comprehensive Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Compare different editorial perspectives and understand complete story contexts 
                through multi-source content aggregation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBolt className="text-gray-800 text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Live Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Continuous content monitoring ensures you receive breaking news and important 
                developments as they happen globally.
              </p>
            </div>
          </div>

          {/* Value proposition */}
          <div ref={benefitsSectionRef} className="bg-gray-50 rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose NewsGenius?
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Balanced Reporting</h4>
                <p className="text-gray-600">
                  Access diverse editorial perspectives to form well-rounded understanding of current events.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Efficiency Focused</h4>
                <p className="text-gray-600">
                  Digest essential information quickly through AI-generated summaries and key highlights.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Customizable Experience</h4>
                <p className="text-gray-600">
                  Tailor content feeds according to your interests and professional requirements.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Continuous Updates</h4>
                <p className="text-gray-600">
                  Round-the-clock monitoring ensures you never miss important developments in your areas of interest.
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
