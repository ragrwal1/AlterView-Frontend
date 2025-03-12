"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState<{[key: string]: boolean}>({
    hero: false,
    features: false,
    cta: false
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  const featuresRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  // Check if element is in viewport - adjusted for quicker triggering
  const isInViewport = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight * 0.85) &&
      rect.bottom >= 0
    );
  }, []);
  // Handle scroll events to check which sections are visible


  
  const handleScroll = useCallback(() => {
    if (featuresRef.current) {
      setVisibleSections(prev => ({
        ...prev,
        features: isInViewport(featuresRef.current!)
      }));
    }
    
    if (ctaRef.current) {
      setVisibleSections(prev => ({
        ...prev,
        cta: isInViewport(ctaRef.current!)
      }));
    }
  }, [isInViewport]);
  // Handle form input changes - immediate feedback
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Handle form submission - faster processing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Faster simulation of API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setFormSuccess(true);
      setFormData({ name: '', email: '', institution: '' });
      
      // Shorter reset time for success message
      setTimeout(() => {
        setFormSuccess(false);
      }, 3000);
    }, 500);
  };
  useEffect(() => {
    setIsLoaded(true);
    setVisibleSections(prev => ({
      ...prev,
      hero: true
    }));
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check for visible sections
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between mb-40 min-h-[80vh] relative z-10">
        <div className={`md:w-3/5 mb-10 md:mb-0 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-alterview-blue">Revolutionizing</span> <br />
            <span className="bg-clip-text text-transparent bg-alterview-gradient">Student Interviews</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Empowering educators with AI-powered interview assessments that provide deeper insights into student understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/student-login" 
              className="px-8 py-3 bg-alterview-indigo hover:bg-alterview-violet text-white rounded-xl font-medium transition-colors duration-200 shadow-soft text-center active:scale-95 transform border-2 border-alterview-indigo"
            >
              Student Portal
            </Link>
            <Link 
              href="/teacher-login" 
              className="px-8 py-3 border-2 border-alterview-indigo text-alterview-indigo hover:bg-alterview-indigo hover:text-white rounded-xl font-medium transition-colors duration-200 text-center active:scale-95 transform"
            >
              Teacher Portal
            </Link>
          </div>
        </div>
        <div className="md:w-2/5 h-80 relative">
          {/* Network graph contained to this area */}
          <div className="absolute inset-0">
            <NetworkGraph contained={true} />
          </div>
        </div>
      </section>
      {/* Background network for the rest of the page (more subtle) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
        <NetworkGraph contained={false} />
      </div>
      {/* Features Section */}
      <section 
        ref={featuresRef} 
        className="mb-40 py-16 relative z-10"
      >
        <div className={`transition-all duration-500 ${
          visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">What Makes Alterview Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-apple hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="bg-alterview-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-alterview-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">AI-Powered Conversations</h3>
              <p className="text-gray-600">Natural, adaptive interview experiences that respond intelligently to student answers.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-apple hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="bg-alterview-indigo/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-alterview-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Detailed Assessments</h3>
              <p className="text-gray-600">Comprehensive reports and insights that help teachers understand their students better.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-apple hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="bg-alterview-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-alterview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Seamless Experience</h3>
              <p className="text-gray-600">Easy to use platform for both students and teachers with minimal setup required.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-16 relative z-10"
      >
        <div className={`transition-all duration-500 ${
          visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="bg-gradient-to-r from-alterview-blue via-alterview-indigo to-alterview-purple rounded-xl p-10 text-white shadow-apple">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Student Interviews?</h2>
              <p className="max-w-lg mx-auto">Join educators who are revolutionizing the way they assess student understanding.</p>
            </div>
            
            <div className="max-w-md mx-auto">
              {formSuccess ? (
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-center animate-fadeIn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                  <p>We've received your information and will be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-white/90">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none text-white placeholder-white/50 transition-all duration-200"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-white/90">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none text-white placeholder-white/50 transition-all duration-200"
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="institution" className="block text-sm font-medium mb-1 text-white/90">Institution</label>
                    <input
                      type="text"
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none text-white placeholder-white/50 transition-all duration-200"
                      placeholder="School or university"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-8 py-3 bg-white text-alterview-indigo hover:bg-gray-100 rounded-xl font-medium transition-all duration-200 active:scale-98 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md'}`}
                  >
                    {isSubmitting ? 'Processing...' : 'Get Started Today'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
// Interactive 3D Network Graph
function NetworkGraph({ contained = false }: { contained?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<any[]>([]);
  const animationRef = useRef<number>(0);
  
  // Colors from the AlterView palette
  const nodeColors = [
    '#4169E1', // blue
    '#4F86F7', // lightblue
    '#5D3FD3', // indigo
    '#8A2BE2', // violet
    '#9370DB', // lavender
    '#800080', // purple
  ];
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      const parentRect = canvas.parentElement?.getBoundingClientRect();
      
      if (parentRect) {
        canvas.width = parentRect.width;
        canvas.height = parentRect.height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    
    // Create nodes
    const createNodes = () => {
      const newNodes = [];
      const nodeCount = contained ? 15 : 25; // Fewer nodes if contained
      
      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 200 - 100, // Z-axis for 3D effect (-100 to 100)
          radius: contained ? (3 + Math.random() * 4) : (4 + Math.random() * 6), // Smaller nodes if contained
          color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
          velocity: {
            x: (Math.random() - 0.5) * (contained ? 0.4 : 0.5), // Slightly faster movement
            y: (Math.random() - 0.5) * (contained ? 0.4 : 0.5),
            z: (Math.random() - 0.5) * (contained ? 0.3 : 0.4),
          },
          connections: [] as number[],
        });
      }
      
      // Create connections between nodes (network edges)
      for (let i = 0; i < newNodes.length; i++) {
        const connectionCount = 2 + Math.floor(Math.random() * 3); // 2-4 connections per node
        for (let j = 0; j < connectionCount; j++) {
          const target = Math.floor(Math.random() * newNodes.length);
          if (target !== i && !newNodes[i].connections.includes(target)) {
            newNodes[i].connections.push(target);
          }
        }
      }
      
      nodesRef.current = newNodes;
    };
    
    createNodes();
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections first (behind nodes)
      ctx.lineWidth = contained ? 0.8 : 1; // Slightly thinner lines if contained
      const nodes = nodesRef.current;
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        for (const targetId of node.connections) {
          const target = nodes[targetId];
          if (!target) continue;
          
          // Calculate opacity based on z positions (3D effect)
          const zFactor = (200 - Math.abs(node.z - target.z)) / 200;
          const opacity = (contained ? 0.4 : 0.3) * zFactor; // Higher opacity for contained
          
          // Draw connection
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(125, 100, 255, ${opacity})`;
          ctx.stroke();
        }
      }
      
      // Then draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Update position
        node.x += node.velocity.x;
        node.y += node.velocity.y;
        node.z += node.velocity.z;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.velocity.x *= -1;
        if (node.y < 0 || node.y > canvas.height) node.velocity.y *= -1;
        if (node.z < -100 || node.z > 100) node.velocity.z *= -1;
        
        // Calculate size based on z position (3D effect)
        const scale = (node.z + 100) / 200; // 0 to 1 based on z (-100 to 100)
        const displayRadius = node.radius * (0.5 + scale * 0.8); // Scale between 50% and 130%
        const opacity = 0.6 + scale * 0.4; // Higher base opacity
        
        // Draw node with glow effect
        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, displayRadius * 0.5,
          node.x, node.y, displayRadius * 2
        );
        gradient.addColorStop(0, node.color + "80"); // Semi-transparent
        gradient.addColorStop(1, node.color + "00"); // Transparent
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, displayRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Main node
        ctx.beginPath();
        ctx.arc(node.x, node.y, displayRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color + Math.round(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [contained]);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
} 