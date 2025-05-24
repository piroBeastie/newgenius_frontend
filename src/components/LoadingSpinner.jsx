import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function LoadingSpinner({ message = "Loading..." }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const messageRef = useRef(null);
  const dotsRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline();
    
    gsap.set([logoRef.current, messageRef.current, dotsRef.current], {
      opacity: 0,
      y: 20
    });

    timeline.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    })
    .to(messageRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .to(dotsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3");

    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div ref={logoRef} className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">NewsGenius</h1>
      </div>
      
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        <div className="w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin absolute top-2 left-2 animate-reverse-spin"></div>
      </div>
      
      <p ref={messageRef} className="mt-6 text-gray-600 text-lg">{message}</p>
      
      <div ref={dotsRef} className="flex space-x-2 mt-4">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
