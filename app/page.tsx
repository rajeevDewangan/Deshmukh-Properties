"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Menu, X, ChevronLeft, ChevronRight, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MessageCircle } from "lucide-react"
import { WavyBackground } from "@/components/ui/wavy-background"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { useIsMobile } from "@/components/ui/use-mobile"
import { UpcomingStrip } from "@/components/ui/upcoming-strip"


export default function DeshmukhProperties() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPinchDistance, setLastPinchDistance] = useState(0);
  const [isPinching, setIsPinching] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Using EmailJS for immediate email sending
      const emailData = {
        to_email: 'deshmukhsunil266@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        subject: `Contact from ${formData.name} - Deshmukh Properties`
      };

      // EmailJS configuration (you can get these from emailjs.com)
      const serviceId = 'service_deshmukh'; // Replace with your EmailJS service ID
      const templateId = 'template_contact'; // Replace with your EmailJS template ID
      const publicKey = 'your_public_key'; // Replace with your EmailJS public key

      // For now, let's use a simple fetch to a free email service
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: emailData.to_email,
            from_name: emailData.from_name,
            from_email: emailData.from_email,
            message: emailData.message,
            subject: emailData.subject
          }
        }),
      });

      if (response.ok) {
        toast({
          title: "Email Sent!",
          description: "Your message has been sent successfully. We'll get back to you soon!",
          className: "bg-green-300 text-black",
        });
        
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Fallback: Create mailto link if EmailJS fails
        const subject = encodeURIComponent(emailData.subject);
        const body = encodeURIComponent(
          `Name: ${emailData.from_name}\nEmail: ${emailData.from_email}\n\nMessage:\n${emailData.message}`
        );
        const mailtoLink = `mailto:${emailData.to_email}?subject=${subject}&body=${body}`;
        
        window.open(mailtoLink, '_blank');
        
        toast({
          title: "Email Opened!",
          description: "Your email client opened with the message ready to send",
          className: "bg-green-300 text-black",
        });
        
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Fallback: Create mailto link
      const subject = encodeURIComponent(`Contact from ${formData.name} - Deshmukh Properties`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:deshmukhsunil266@gmail.com?subject=${subject}&body=${body}`;
      
      window.open(mailtoLink, '_blank');
      
      toast({
        title: "Email Opened!",
        description: "Your email client opened with the message ready to send",
        className: "bg-green-300 text-black",
      });
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Hero background images
  const heroImages = [
    "/heroimg1.jpg",
    "/heroimg2.jpg", 
    "/heroimg3.jpg",
    "/heroimg4.jpg"
  ];
  
  // Close mobile menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
      setIsMobileMenuOpen(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  // Add keyboard listener for image modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
        setImageZoom(1);
        setImagePosition({ x: 0, y: 0 });
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (selectedImage) {
        // Only prevent if the event is not on the image modal
        const target = event.target as Element;
        if (!target.closest('.image-modal-container')) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('wheel', handleWheel, { passive: false });
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Reset zoom and position when image changes
  useEffect(() => {
    if (selectedImage) {
      setImageZoom(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [selectedImage]);

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setImageZoom(prev => {
      const newZoom = Math.max(1, Math.min(5, prev * delta));
      // If zooming back to 100%, center the image
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  // Handle mouse drag with requestAnimationFrame for smooth performance
  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageZoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      e.preventDefault();
      requestAnimationFrame(() => {
        setImagePosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch events for mobile with pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - drag
      if (imageZoom > 1) {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - imagePosition.x, y: touch.clientY - imagePosition.y });
      }
    } else if (e.touches.length === 2) {
      // Two touches - pinch to zoom
      e.preventDefault();
      setIsPinching(true);
      setIsDragging(false);
      const distance = getDistance(e.touches[0], e.touches[1]);
      setLastPinchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && imageZoom > 1) {
      // Single touch drag
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      requestAnimationFrame(() => {
        setImagePosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y
        });
      });
    } else if (e.touches.length === 2 && isPinching) {
      // Two touch pinch zoom
      e.preventDefault();
      e.stopPropagation();
      const distance = getDistance(e.touches[0], e.touches[1]);
      if (lastPinchDistance > 0) {
        const scale = distance / lastPinchDistance;
        requestAnimationFrame(() => {
          setImageZoom(prev => {
            const newZoom = Math.max(1, Math.min(5, prev * scale));
            // If zooming back to 100%, center the image
            if (newZoom === 1) {
              setImagePosition({ x: 0, y: 0 });
            }
            return newZoom;
          });
        });
      }
      setLastPinchDistance(distance);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 0) {
      // All touches ended
      setIsDragging(false);
      setIsPinching(false);
      setLastPinchDistance(0);
    } else if (e.touches.length === 1 && isPinching) {
      // Went from pinch to single touch
      setIsPinching(false);
      setLastPinchDistance(0);
      if (imageZoom > 1) {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - imagePosition.x, y: touch.clientY - imagePosition.y });
      }
    }
  };

  // Smooth scroll function with fallback for mobile
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Check if smooth scrolling is supported
    const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    
    if (supportsSmoothScroll) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      // Fallback for browsers that don't support smooth scrolling
      const targetPosition = element.offsetTop - 80; // Account for fixed header
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let start: number | null = null;

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animation);
    }
  };

  // Glow border mouse tracking effect
  useEffect(() => {
    const root = document.documentElement;
    let mx = -9999, 
        my = -9999,
        rafId = 0;

    function apply() {
      rafId = 0;
      root.style.setProperty("--mx", mx.toString());
      root.style.setProperty("--my", my.toString());
    }

    function move(e: PointerEvent) {	
      mx = e.clientX;
      my = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(apply);
    }

    function leave() {
      mx = -9999;
      my = -9999;
      if (!rafId) rafId = requestAnimationFrame(apply);
    }

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("pointerleave", leave, { passive: true });

    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Rotate hero background images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  // Land Properties - 4 distinct land/plot properties
  const landProperties = [
      {
        id: 1,
        image: "/patora.png",
        modalImage: "/patora.webp",
        title: "Residential & Commercial",
        description: "Prime location plots on Utai to Patan 4 Lane Main Road. Perfect for both residential and commercial development.",
        price: "₹25,00,000",
        location: "Utai to Patan 4 Lane Main Road, Patora 1km left from the road",
        size: "2,200-3,700 sq ft",
        type: "Patora"
      },
      {
        id: 2,
        image: "/dumardih.png",
        modalImage: "/dumardih.webp",
        title: "Premium Farmhouse Plot",
        description: "Spacious farmhouse plots with excellent soil quality and water facilities. Perfect for building your dream farmhouse.",
        price: "₹18,50,000",
        location: "Utai to Patan 4 Lane Main Road, Patora 1km left from the road",
        size: "4,700-8,700 sq ft",
        type: "Dumardih"
      },
      {
        id: 3,
        image: "/kuthrel.png",
        modalImage: "/kuthrel.webp",
        title: "Residential Plot",
        description: "Conveniently located residential plots just 200m from the bus stand. Perfect for building your home with easy access to public transportation.",
        price: "₹45,00,000",
        location: "200m Away from Bus Stand, Kuthrel",
        size: "750-1,800 sq ft",
        type: "Kuthrel"
      },
      {
        id: 4,
        image: "/utai.png",
        modalImage: "/utai.webp",
        title: "Residential & Commercial",
        description: "Versatile plots in Indira Nagar, Utai. Suitable for both residential and commercial development with excellent infrastructure and connectivity.",
        price: "₹75,00,000",
        location: "Indira Nagar, Utai",
        size: "250-3,300 sq ft",
        type: "Utai"
      }
  ];

  // Building Properties - 4 distinct building properties
  const buildingProperties = [
    {
      id: 5,
      image: "/commercial-plot-near-highway.png",
      title: "Shopping Mall Building",
      description: "Multi-story shopping mall with parking and modern amenities. High foot traffic location with multiple retail spaces.",
      price: "₹2,50,00,000",
      location: "Raipur, Chhattisgarh",
      size: "50,000 sq ft",
      type: "Commercial Building"
    },
    {
      id: 6,
      image: "/residential-land-plot-with-trees.png",
      title: "Luxury Apartment Complex",
      description: "Premium apartment building with swimming pool and gym. Modern amenities and 24/7 security for comfortable living.",
      price: "₹1,85,00,000",
      location: "Bilaspur, Chhattisgarh",
      size: "25,000 sq ft",
      type: "Residential Building"
    },
    {
      id: 7,
      image: "/industrial-land-with-road-access.png",
      title: "Warehouse Building",
      description: "Large warehouse facility with loading docks and security. Perfect for storage, distribution, or manufacturing operations.",
      price: "₹95,00,000",
      location: "Durg, Chhattisgarh",
      size: "15,000 sq ft",
      type: "Industrial Building"
    },
    {
      id: 8,
      image: "/commercial-plot-near-highway.png",
      title: "Office Tower",
      description: "Modern office building with conference rooms and cafeteria. Ideal for corporate offices, IT companies, or business centers.",
      price: "₹1,20,00,000",
      location: "Bhilai, Chhattisgarh",
      size: "30,000 sq ft",
      type: "Office Building"
    }
  ];



  return (
    <div className="min-h-screen bg-[#EEEEEE] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mt-2 mx-2 rounded-2xl" style={{
        background: 'linear-gradient(145deg, rgba(96,96,96,0.4), rgba(128,128,128,0.4), rgba(64,64,64,0.4), rgba(112,112,112,0.4))',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)'
      }}>
                  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-yellow-500">
                  <img 
                    src="/logo.png" 
                    alt="Deshmukh Properties Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-baseline space-x-8">
                <a
                  href="#home"
                  className="text-gray-100 hover:text-white px-3 py-2 text-lg font-medium transition-colors rounded-lg hover:bg-opacity-10 font-['Aeonic']"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo('home');
                  }}
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-gray-100 hover:text-white px-3 py-2 text-lg font-medium transition-colors rounded-lg hover:bg-opacity-10 font-['Aeonic']"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo('about');
                  }}
                >
                  About
                </a>
                <a
                  href="#properties"
                  className="text-gray-100 hover:text-white px-3 py-2 text-lg font-medium transition-colors rounded-lg hover:bg-opacity-10 font-['Aeonic']"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo('properties');
                  }}
                >
                  Properties
                </a>
                <a
                  href="#contact"
                  className="text-gray-100 hover:text-white px-3 py-2 text-lg font-medium transition-colors rounded-lg hover:bg-opacity-10 font-['Aeonic']"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo('contact');
                  }}
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mobile-menu-button p-2 text-white hover:bg-white hover:bg-opacity-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-container md:hidden fixed top-0 left-0 right-0 z-40 mt-20 mx-2 rounded-2xl" style={{
          background: 'linear-gradient(145deg, rgba(96,96,96,0.4), rgba(128,128,128,0.4), rgba(64,64,64,0.4), rgba(112,112,112,0.4))',
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)'
        }}>
          <div className="p-6">
            <div className="space-y-4">
              <a
                href="#home"
                className="block text-3xl font-medium text-white hover:text-gray-200 transition-colors py-4 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 font-['Aeonic']"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    smoothScrollTo('home');
                  }, 100);
                }}
              >
                Home
              </a>
              <a
                href="#about"
                className="block text-3xl font-medium text-white hover:text-gray-200 transition-colors py-4 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 font-['Aeonic']"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    smoothScrollTo('about');
                  }, 100);
                }}
              >
                About
              </a>
              <a
                href="#properties"
                className="block text-3xl font-medium text-white hover:text-gray-200 transition-colors py-4 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 font-['Aeonic']"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    smoothScrollTo('properties');
                  }, 100);
                }}
              >
                Properties
              </a>
              <a
                href="#contact"
                className="block text-3xl font-medium text-white hover:text-gray-200 transition-colors py-4 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 font-['Aeonic']"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    smoothScrollTo('contact');
                  }, 100);
                }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="image-modal-container fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-4"
          onClick={(e) => {
            // Only close if clicking on the background, not the image
            if (e.target === e.currentTarget) {
              setSelectedImage(null);
              setImageZoom(1);
              setImagePosition({ x: 0, y: 0 });
            }
          }}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center overflow-hidden">
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={selectedImage}
                alt="Property Image"
                className="object-contain rounded-xl shadow-2xl border border-white/20 select-none"
                style={{ 
                  transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  willChange: isDragging ? 'transform' : 'auto'
                }}
                draggable={false}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelectedImage(null);
                  setImageZoom(1);
                  setImagePosition({ x: 0, y: 0 });
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelectedImage(null);
                  setImageZoom(1);
                  setImagePosition({ x: 0, y: 0 });
                }}
                className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/20 z-20"
                aria-label="Close image"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Zoom controls - hidden on mobile */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 hidden md:flex">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageZoom(prev => Math.min(5, prev + 0.5));
                  }}
                  className="bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all duration-200 backdrop-blur-sm border border-white/20"
                  aria-label="Zoom in"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageZoom(prev => Math.max(1, prev - 0.5));
                  }}
                  className="bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all duration-200 backdrop-blur-sm border border-white/20"
                  aria-label="Zoom out"
                >
                  <span className="text-lg font-bold">-</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageZoom(1);
                    setImagePosition({ x: 0, y: 0 });
                  }}
                  className="bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all duration-200 backdrop-blur-sm border border-white/20 text-xs"
                  aria-label="Reset zoom"
                >
                  Reset
                </button>
              </div>
              
              
              {/* Zoom level indicator */}
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20 text-sm">
                {Math.round(imageZoom * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center pt-16">
        {/* Background Images with Smooth Transitions */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <img 
              key={image}
              src={image} 
              alt={`Hero Background ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 -mt-40">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-2">We Buy, Sell & Consult Properties</h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 px-2">
            Your trusted partners in land and property transactions across Chhattisgarh
          </p>
        </div> */}

        {/* Feature Component*/}
        <div className="absolute bottom-4 left-0 right-0 z-20 px-2 sm:px-4">
          <div className="bg-black/50 backdrop-blur-xs rounded-2xl border border-gray-600/30 p-4 sm:p-6 lg:p-8 w-full overflow-hidden" style={{ minHeight: '300px' }}>
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
              {/* Left Section */}
              <div className="w-full lg:w-1/3 text-center lg:text-left h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 sm:mb-6 font-outfit">Deshmukh Properties</h2>
                  <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-11 font-light font-outfit">Your trusted property partners.</p>
                  <div className="w-16 sm:w-20 lg:w-86 h-px bg-gray-400 mb-6 sm:mb-8 lg:mb-9 mx-auto lg:mx-0"></div>
                </div>
                
                <div className="flex flex-row gap-4 sm:gap-6 lg:gap-10 justify-center lg:justify-start">
                  <Button 
                    variant="outline" 
                    className="text-white hover:bg-white/10 transition-all duration-300 font-outfit w-32 h-9 text-sm"
                    style={{
                      background: 'linear-gradient(145deg, rgba(192,192,192,0.4), rgba(224,224,224,0.4), rgba(160,160,160,0.4), rgba(208,208,208,0.4))',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onClick={() => {
                      smoothScrollTo('properties');
                    }}
                  >
                    View Properties
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-white hover:bg-white/10 transition-all duration-300 font-outfit w-24 h-9 text-sm"
                    style={{
                      background: 'linear-gradient(145deg, rgba(192,192,192,0.4), rgba(224,224,224,0.4), rgba(160,160,160,0.4), rgba(208,208,208,0.4))',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onClick={() => {
                      smoothScrollTo('contact');
                    }}
                  >
                    Call Us
                  </Button>
                </div>
              </div>

              {/* Middle Section */}
                 <div className="w-full lg:w-1/3 text-center lg:text-left h-full flex flex-col justify-between max-w-[496px] lg:max-w-116">
                  <h3 className="text-base sm:text-lg font-light text-gray-200 mb-3 sm:mb-4 font-outfit">From residential houses to agricultural lands</h3>
                  <p className="text-gray-400 text-md sm:text-md mb-3 sm:mb-4 leading-relaxed font-light font-outfit">
                    We offer a wide range of properties including residential plots, commercial spaces, 
                    agricultural farmland, and industrial lands to meet all your real estate needs.
                  </p>
                  <div className="w-16 sm:w-20 lg:w-116 h-px bg-gray-400 mb-3 sm:mb-4 mx-auto lg:mx-0"></div>
                  <p className="text-gray-400 text-md sm:text-md leading-relaxed font-light font-outfit">
                    Easy to get your dream land, or investment property with our expert guidance 
                    and comprehensive property solutions.
                  </p>
                </div>

              {/* Right Section - Image */}
              <div className="w-full lg:w-1/3 flex justify-center items-center">
                <img 
                  src="/shop1.jpg" 
                  alt="Property Landscape" 
                  className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-auto rounded-xl shadow-2xl"
                  style={{ maxHeight: '250px', minHeight: '250px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

           {/* About Us Section */}
      <section id="about" className="py-10 pt-22 px-4 bg-[#0E0E0E] relative overflow-hidden">
        {/* Wavy Background Effect - Top 30% */}
        <div className="absolute -top-14 left-0 right-0 h-96 z-0">
          <WavyBackground
            containerClassName="h-full"
            backgroundFill="#0E0E0E"
            //colors={["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"]}
            colors={[
              "#93c5fd", // blue-300
              "#60a5fa", // blue-400
              "#3b82f6", // blue-500
              "#a5b4fc", // indigo-300
              "#ddd6fe", // violet-200
            ]}
            waveWidth={48}
            blur={8}
            speed="slow"
            waveOpacity={0.5}
            className="w-full h-full"
          />
        </div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-8xl font-bold text-gray-300 mb-10 px-2 font-['Aeonic']">
                About Deshmukh Properties
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto px-4 font-outfit mt-8">
                With years of experience in the real estate industry, we are your trusted partners for all property needs.
                Our expertise spans across residential, commercial, agricultural, and industrial properties.
              </p>
            </div>

          {/* New Layout: Brothers Cards + Services */}
          <div className="flex flex-col lg:flex-row gap-8 max-w-8xl mx-auto">
            {/* Brothers Cards - Side by side layout */}
            <div className="flex flex-row md:flex-row lg:flex-col gap-8 justify-center">
              {/* Sunil Deshmukh Card */}
              <div className="glow-border relative h-58 w-58 rounded-xl overflow-hidden" style={{
                background: '#111111',
                border: '0.25px solid #666666',
                borderRadius: '12px'
              }}>
                                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-2.5 bg-white rounded-md overflow-hidden" style={{
                      boxShadow: isMobile ? '0 0 10px rgba(170, 170, 170, 0.5), 0 0 16px rgba(170, 170, 170, 0.3), 0 0 30px rgba(170, 170, 170, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)' : '0 0 10px rgba(170, 170, 170, 0.3), 0 0 14px rgba(170, 170, 170, 0.2), 0 0 18px rgba(170, 170, 170, 0.1)'
                    }}>
                      <img
                        src="/profilepic.webp"
                        alt="Sunil Deshmukh"
                        className="w-full h-full object-cover opacity-90"
                      />
                      {/* Shadow overlay */}
                      <div className="absolute inset-0 bg-black/5 shadow-inner"></div>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-[1.5px] rounded-xl bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                  </div>
                
                {/* Name and Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-light text-xl mb-0 font-outfit">
                    Sunil Deshmukh
                  </h3>
                  <p className="text-gray-200 font-outfit text-sm font-light">
                    Owner
                  </p>
                </div>
              </div>

              {/* Quote Text - Same area as Anil's card */}
              <div className="relative h-58 w-58 flex items-center justify-center p-6 mb-8 md:mb-0">
                <div className="text-center">
                  <p className="text-lg text-gray-300 italic font-outfit leading-relaxed mb-4">
                    "Building dreams, one property at a time. We don't just sell land, we help you invest in your future."
                  </p>
                  <p className="text-sm text-gray-400 font-outfit">
                    - Sunil Deshmukh, Owner
                  </p>
                </div>
              </div>

            </div>

            {/* Services Cards - Stacked on tablet, side by side on desktop */}
            <div className="flex flex-col lg:flex-row gap-8 lg:flex-1">
              {/* Our Services Card with Background Gradient Animation */}
              <div className="glow-border flex-1 relative bg-[#111111] overflow-hidden rounded-xl md:h-[500px] h-[600px] p-2.5" style={{
                border: '0.25px solid #666666',
                borderRadius: '12px'
              }}>
                {/* Desktop version */}
                <div className="hidden md:block h-full w-full rounded-md overflow-hidden" style={{
                  boxShadow: '0 0 6px rgba(170, 170, 170, 0.3), 0 0 10px rgba(170, 170, 170, 0.2), 0 0 16px rgba(170, 170, 170, 0.1)'
                }}>
                  <BackgroundGradientAnimation
                    gradientBackgroundStart="rgb(15, 15, 15)"
                    gradientBackgroundEnd="rgb(20, 20, 20)"
                    firstColor="219, 234, 254"
                    secondColor="222, 219, 254"
                    thirdColor="147, 197, 253"
                    fourthColor="96, 165, 250"
                    fifthColor="59, 130, 246"
                    pointerColor="34, 197, 94"
                    size="150%"
                    blendingValue="screen"
                    interactive={false}
                    containerClassName="h-full w-full"
                    className="relative z-10 p-6"
                  >
                    <div className="h-full flex flex-col justify-between">
                      <h2 
                        className="text-2xl md:text-4xl font-semibold text-white font-['Aeonic'] mb-4 text-right"
                        style={{
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                          filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
                        }}
                      >
                        Our Services
                      </h2>
                        <div className="space-y-2 md:space-y-3">
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Sale of Land: Commercial, Residential, and Agricultural</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Resale Properties: Plots, Land, and Residential Homes</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Assistance with Property Registration</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Diversion and Simankan Services</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Investment Advisory</div>
                        </div>
                    </div>
                  </BackgroundGradientAnimation>
                </div>

                {/* Mobile version - Exact copy of Areas We Serve */}
                <div className="md:hidden flex-1 rounded-md relative overflow-hidden h-[600px] p-0" style={{
                  background: '#111111',
                  borderRadius: '12px',
                  boxShadow: '0 0 8px rgba(170, 170, 170, 0.4), 0 0 12px rgba(170, 170, 170, 0.2), 0 0 20px rgba(170, 170, 170, 0.1), inset 0 0 25px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="h-full w-full rounded-md overflow-hidden" style={{
                    boxShadow: '0 0 6px rgba(170, 170, 170, 0.3), 0 0 10px rgba(170, 170, 170, 0.2), 0 0 16px rgba(170, 170, 170, 0.1)'
                  }}>
                    <BackgroundGradientAnimation
                      gradientBackgroundStart="rgb(15, 15, 15)"
                      gradientBackgroundEnd="rgb(20, 20, 20)"
                      firstColor="219, 234, 254"
                      secondColor="222, 219, 254"
                      thirdColor="147, 197, 253"
                      fourthColor="96, 165, 250"
                      fifthColor="59, 130, 246"
                      pointerColor="34, 197, 94"
                      size="150%"
                      blendingValue="screen"
                      interactive={false}
                      containerClassName="h-full w-full"
                      className="relative z-10 p-6"
                    >
                      <div className="h-full flex flex-col justify-between">
                        <h2 
                          className="text-4xl md:text-4xl font-semibold text-white font-['Aeonic'] mb-6 text-right"
                          style={{
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
                          }}
                        >
                          Our Services
                        </h2>
                        <div className="space-y-3 md:space-y-3">
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Sale of Land: Commercial, Residential, and Agricultural</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Resale Properties: Plots, Land, and Residential Homes</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Assistance with Property Registration</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Diversion and Simankan Services</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Investment Advisory</div>
                        </div>
                      </div>
                    </BackgroundGradientAnimation>
                  </div>
                </div>
              </div>

              {/* Areas We Serve Card with Background Gradient Animation */}
              <div className="glow-border flex-1 relative bg-[#111111] overflow-hidden rounded-xl md:h-[500px] h-[600px] p-2.5" style={{
                border: '0.25px solid #666666',
                borderRadius: '12px'
              }}>
                {/* Desktop version */}
                <div className="hidden md:block h-full w-full rounded-md overflow-hidden" style={{
                  boxShadow: '0 0 6px rgba(170, 170, 170, 0.3), 0 0 10px rgba(170, 170, 170, 0.2), 0 0 16px rgba(170, 170, 170, 0.1)'
                }}>
                  <BackgroundGradientAnimation
                    gradientBackgroundStart="rgb(15, 15, 15)"
                    gradientBackgroundEnd="rgb(20, 20, 20)"
                    firstColor="219, 234, 254"
                    secondColor="222, 219, 254"
                    thirdColor="147, 197, 253"
                    fourthColor="96, 165, 250"
                    fifthColor="59, 130, 246"
                    pointerColor="34, 197, 94"
                    size="150%"
                    blendingValue="screen"
                    interactive={false}
                    containerClassName="h-full w-full"
                    className="relative z-10 p-6"
                  >
                    <div className="h-full flex flex-col justify-between">
                      <h2 
                        className="text-2xl md:text-4xl font-semibold text-white font-['Aeonic'] mb-4 text-right"
                        style={{
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                          filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
                        }}
                      >
                        Areas We Serve
                      </h2>
                        <div className="space-y-2 md:space-y-3">
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Risali</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Dhanora</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Umarpoti</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Utai</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Patora</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Anda</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Kuthrel</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Deurjhal</div>
                          <div className="text-xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Dumardih</div>
                        </div>
                    </div>
                  </BackgroundGradientAnimation>
                </div>

                {/* Mobile version - Same as Our Services */}
                <div className="md:hidden flex-1 rounded-md relative overflow-hidden h-[600px] p-0" style={{
                  background: '#111111',
                  borderRadius: '12px',
                  boxShadow: '0 0 8px rgba(170, 170, 170, 0.4), 0 0 12px rgba(170, 170, 170, 0.2), 0 0 20px rgba(170, 170, 170, 0.1), inset 0 0 25px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="h-full w-full rounded-md overflow-hidden" style={{
                    boxShadow: '0 0 6px rgba(170, 170, 170, 0.3), 0 0 10px rgba(170, 170, 170, 0.2), 0 0 16px rgba(170, 170, 170, 0.1)'
                  }}>
                    <BackgroundGradientAnimation
                      gradientBackgroundStart="rgb(15, 15, 15)"
                      gradientBackgroundEnd="rgb(20, 20, 20)"
                      firstColor="219, 234, 254"
                      secondColor="222, 219, 254"
                      thirdColor="147, 197, 253"
                      fourthColor="96, 165, 250"
                      fifthColor="59, 130, 246"
                      pointerColor="34, 197, 94"
                      size="150%"
                      blendingValue="screen"
                      interactive={false}
                      containerClassName="h-full w-full"
                      className="relative z-10 p-6"
                    >
                      <div className="h-full flex flex-col justify-between">
                        <h2 
                          className="text-4xl md:text-4xl font-semibold text-white font-['Aeonic'] mb-6 text-right"
                          style={{
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
                          }}
                        >
                          Areas We Serve
                        </h2>
                        <div className="space-y-3 md:space-y-3">
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Risali</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Dhanora</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Umarpoti</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Utai</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Patora</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Anda</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Kuthrel</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Deurjhal</div>
                          <div className="text-3xl md:text-2xl text-white/90 font-light font-outfit" style={{ textShadow: '0 4px 14px rgba(0, 0, 0, 0.8)' }}>Dumardih</div>
                        </div>
                      </div>
                    </BackgroundGradientAnimation>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-10 pt-22 relative overflow-hidden"
      style={{
                    background: 'linear-gradient( #000000 0px, #FDFAF6 340px)',
                    //border: '1px solid rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}>
                {/* Aceternity UI Aurora Background */}
        <div className="fixed top-0 left-2 w-screen h-128 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 overflow-hidden"
            style={
              {
                "--aurora":
                  "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
                "--dark-gradient":
                  "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
                "--white-gradient":
                  "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",

                "--blue-300": "#93c5fd",
                "--blue-400": "#60a5fa",
                "--blue-500": "#3b82f6",
                "--indigo-300": "#a5b4fc",
                "--violet-200": "#ddd6fe",
                "--black": "#000",
                "--white": "#fff",
                "--transparent": "transparent",
              } as React.CSSProperties
            }
          >
            <div
              className="after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-70 blur-[8px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[''] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)] [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]"
            ></div>
          </div>
        </div>
        <div className="max-w-8xl mx-4px px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-8xl font-bold text-neutral-800 mb-6 px-2 font-['Aeonic']">
              Featured Properties
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 px-4 mx-2 sm:mx-0 font-outfit">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          {/* Land Section */}
          <div className="mb-16">
            <h2 className="text-5xl font-bold text-neutral-600 mb-8 text-center font-['Aeonic']">
              Land & Plots
            </h2>
            <div className="relative">
              {/* Land Grid */}
              {/* Mobile: Show all land properties */}
              <div className="md:hidden">
                {landProperties.map((property) => (
                  <Card key={property.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6 mx-4" style={{
                    background: 'linear-gradient( #0F0F0E 0%, #C7C8CC 90%, #CCCCCC 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}>
                    <div className="aspect-[4/3] overflow-hidden m-3 rounded-[12px]">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        style={{
                          boxShadow: 'inset 28px 28px 40px #D1D9E6'
                        }}
                        onClick={() => setSelectedImage(property.modalImage || property.image || "/placeholder.svg")}
                      />
                    </div>
                    <CardContent className="p-4 pt-2">
                      <h3 className="text-2xl font-outfit text-neutral-800 mb-2 h-12 flex items-center">{property.title}</h3>
                      <p className="text-md font-outfit text-neutral-600 mb-2 font-light h-16 flex items-start leading-relaxed">{property.description}</p>
                      <p className="text-md font-outfit text-neutral-600 mb-2 font-light h-12 flex items-center">
                        {property.location}
                      </p>
                      <div className="flex justify-between items-center h-8">
                        <p className="text-lg font-outfit text-neutral-600 font-semibold">{property.size}</p>
                        <span className="text-sm font-outfit text-neutral-500 bg-neutral-200 px-2 py-1 rounded flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.type}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Desktop: Show all 4 land properties */}
              <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8">
                {landProperties.map((property) => (
              <Card key={property.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300" style={{
                  background: 'linear-gradient( #0F0F0E 0%, #C7C8CC 90%, #CCCCCC 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)'
                }}>
                  <div className="aspect-[4/3] overflow-hidden m-3 rounded-[12px]">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      style={{
                        boxShadow: 'inset 28px 28px 40px #D1D9E6'
                      }}
                      onClick={() => setSelectedImage(property.modalImage || property.image || "/placeholder.svg")}
                    />
                  </div>
                  <CardContent className="p-4 pt-0">
                    <h3 className="text-2xl font-outfit text-neutral-800 mb-2 h-12 flex items-center">{property.title}</h3>
                    <p className="text-sm font-outfit text-neutral-600 mb-2 font-light h-16 flex items-start leading-relaxed">{property.description}</p>
                    <p className="text-sm font-outfit text-neutral-600 mb-2 font-light h-12 flex items-center">
                      {property.location}
                    </p>
                    <div className="flex justify-between items-center h-8">
                      <p className="text-lg font-outfit text-neutral-600 font-semibold">{property.size}</p>
                      <span className="text-sm font-outfit text-neutral-500 bg-neutral-200 px-2 py-1 rounded flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.type}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Properties Section */}
          <div>
            <h2 className="text-5xl font-bold text-neutral-600 mb-8 text-center font-['Aeonic']">
              Properties & Buildings
            </h2>
            <div className="relative">
              {/* Properties Grid */}
              {/* Mobile: Show only 1 building property */}
              <div className="md:hidden relative">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6 mx-4" style={{
                  background: 'linear-gradient( #CCCCCC 0%, #1F1F1E 60%, #0F0F0E 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  filter: 'blur(2px)'
            }}>
                  <div className="aspect-[4/3] overflow-hidden m-3 rounded-[12px]">
                <img
                  src={buildingProperties[0].image || "/placeholder.svg"}
                  alt={buildingProperties[0].title}
                  className="w-full h-full object-cover"
                  style={{
                    boxShadow: 'inset 28px 28px 40px #D1D9E6'
                  }}
                />
              </div>
                                      <CardContent className="p-4 pt-2">
                    <h3 className="text-2xl font-outfit text-white mb-2">{buildingProperties[0].title}</h3>
                    <p className="text-md font-outfit text-neutral-500 mb-2 font-light">{buildingProperties[0].description}</p>
                    <p className="text-md font-outfit text-neutral-500 flex items-center mb-2 font-light">
                      <MapPin className="w-4 h-4 mr-2" />
                      {buildingProperties[0].location}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-outfit text-neutral-300 font-semibold">{buildingProperties[0].size}</p>
                      <span className="text-sm font-outfit text-neutral-400 bg-neutral-700 px-2 py-1 rounded">{buildingProperties[0].type}</span>
                    </div>
              </CardContent>
                </Card>
                
                {/* Upcoming Strip for Mobile Building Properties */}
                <div className="absolute inset-0 pointer-events-none mx-4">
                  <UpcomingStrip className="w-full h-full" />
                </div>
              </div>
              
              {/* Desktop: Show all 4 building properties */}
              <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8 relative overflow-hidden">
                {buildingProperties.map((property) => (
                  <Card key={property.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300" style={{
                    background: 'linear-gradient( #CCCCCC 0%, #1F1F1E 60%, #0F0F0E 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    filter: 'blur(2px)'
                  }}>
                    <div className="aspect-[4/3] overflow-hidden m-3 rounded-[12px]">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        style={{
                          boxShadow: 'inset 28px 28px 40px #D1D9E6'
                        }}
                      />
                  </div>
                                        <CardContent className="p-4 pt-2">
                      <h3 className="text-2xl font-outfit text-white mb-2">{property.title}</h3>
                      <p className="text-sm font-outfit text-neutral-500 mb-2 font-light">{property.description}</p>
                      <p className="text-sm font-outfit text-neutral-500 flex items-center mb-2 font-light">
                        <MapPin className="w-4 h-4 mr-2" />
                      {property.location}
                    </p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-outfit text-neutral-300 font-semibold">{property.size}</p>
                        <span className="text-sm font-outfit text-neutral-400 bg-neutral-700 px-2 py-1 rounded">{property.type}</span>
                      </div>
                </CardContent>
              </Card>
            ))}
                
                {/* Upcoming Strip for Building Properties */}
                <div className="absolute inset-0 pointer-events-none">
                  <UpcomingStrip className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="pt-24 bg-[#FDFAF6]">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F0E0E] rounded-t-4xl p-8 mt-2 md:p-12">
                          <div className="text-center mb-12">
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-8xl font-bold text-white mb-4 px-2 font-['Aeonic']">Get In Touch</h2>
              <p className="text-md sm:text-xl text-neutral-400 mx-8 font-outfit">Ready to find your perfect property? Contact us today!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Agency Contact */}
              <div>
                <Card className="bg-gray-700 border-gray-600 w-full" style={{
                  background: '#E1FF99', //#FFF085
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(255, 240, 133, 0.2)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  height: '360px'
                }}>
                  <CardContent className="p-5">
                    <h3 className="text-2xl font-bold text-neutral-800 mb-4 font-outfit text-center">Office Address</h3>
                    <div className="space-y-4 text-gray-700">
                      <div className="text-center">
                        <p className="font-outfit text-neutral-500 text-md">
                          <MapPin className="w-4 h-4 mr-2 text-neutral-500 inline" />
                          Risali to borsi 80 feet road, Saraswati Kunj, Bhilai, CG. - 490006
                        </p>
                      </div>
                      <div className="mt-6">
                        <div 
                          className="w-full h-48 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden relative group"
                          onClick={() => {
                            window.open('https://maps.app.goo.gl/wb8SbWupwSqEX6X98', '_blank');
                          }}
                          style={{
                            border: '1.5px solid black'
                          }}
                        >
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d597.1234567890123!2d81.323834!3d21.154351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a293b50f849b745%3A0xc564967f7a59d126!2sRisali%20Chandkhuri%20Rd%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1234567890123"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="transition-opacity duration-200"
                          ></iframe>
                          <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-neutral-600" />
                              <p className="font-outfit text-xs text-gray-700 font-semibold">Open in Maps</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Contact Card */}
              <div>
                {/* Sunil Deshmukh Contact */}
                <Card className="bg-gray-700 border-gray-600 w-full" style={{
                  background: '#FFF4A4',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(245, 232, 134, 0.2)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  height: '360px'
                }}>
                  <CardContent className="p-5">
                    <h4 className="text-2xl font-semibold text-neutral-800 mb-1 font-outfit text-center">Sunil Deshmukh</h4>
                    <p className="text-neutral-500 mb-10 font-outfit text-center text-md">Owner</p>
                    <div className="space-y-10 text-neutral-600">
                      {/* First Number */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                          <p className="font-outfit text-md mr-2">87704 91589</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-black font-outfit text-xs px-2 py-1 h-6 font-black"
                            style={{
                              background: '#F5F5F5',
                              fontFamily: 'inherit',
                              padding: '0.6em 1.3em',
                              fontWeight: '900',
                              fontSize: '12px',
                              border: '1.5px solid black',
                              borderRadius: '0.4em',
                              boxShadow: '0.1em 0.1em',
                              cursor: 'pointer',
                              transition: 'all 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translate(0, 0)';
                              e.currentTarget.style.boxShadow = '0.1em 0.1em';
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.transform = 'translate(0.05em, 0.05em)';
                              e.currentTarget.style.boxShadow = '0.05em 0.05em';
                            }}
                            onMouseUp={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onClick={async () => {
                              try {
                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                  await navigator.clipboard.writeText('8770491589');
                                } else {
                                  // Fallback for older browsers/mobile devices
                                  const textArea = document.createElement('textarea');
                                  textArea.value = '8770491589';
                                  textArea.style.position = 'fixed';
                                  textArea.style.left = '-999999px';
                                  textArea.style.top = '-999999px';
                                  document.body.appendChild(textArea);
                                  textArea.focus();
                                  textArea.select();
                                  document.execCommand('copy');
                                  document.body.removeChild(textArea);
                                }
                                toast({
                                  title: "Copied!",
                                  description: "Phone number copied to clipboard",
                                  className: "bg-neutral-300 text-black",
                                });
                              } catch (error) {
                                toast({
                                  title: "Copy Failed",
                                  description: "Please manually copy: 8770491589",
                                  className: "bg-red-300 text-black",
                                });
                              }
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex justify-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-black font-outfit text-xs px-3 py-1 font-black"
                            style={{
                              background: '#F5F5F5',
                              fontFamily: 'inherit',
                              padding: '0.6em 1.3em',
                              fontWeight: '900',
                              fontSize: '12px',
                              border: '1.5px solid black',
                              borderRadius: '0.4em',
                              boxShadow: '0.1em 0.1em',
                              cursor: 'pointer',
                              transition: 'all 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translate(0, 0)';
                              e.currentTarget.style.boxShadow = '0.1em 0.1em';
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.transform = 'translate(0.05em, 0.05em)';
                              e.currentTarget.style.boxShadow = '0.05em 0.05em';
                            }}
                            onMouseUp={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onClick={() => window.open('tel:+918770491589', '_self')}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-black font-outfit text-xs px-3 py-1 font-black"
                            style={{
                              background: '#F5F5F5',
                              fontFamily: 'inherit',
                              padding: '0.6em 1.3em',
                              fontWeight: '900',
                              fontSize: '12px',
                              border: '1.5px solid black',
                              borderRadius: '0.4em',
                              boxShadow: '0.1em 0.1em',
                              cursor: 'pointer',
                              transition: 'all 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translate(0, 0)';
                              e.currentTarget.style.boxShadow = '0.1em 0.1em';
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.transform = 'translate(0.05em, 0.05em)';
                              e.currentTarget.style.boxShadow = '0.05em 0.05em';
                            }}
                            onMouseUp={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onClick={() => window.open('https://wa.me/918770491589', '_blank')}
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                      
                      {/* Second Number */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                          <p className="font-outfit text-md mr-2">95756 58550</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-black font-outfit text-xs px-2 py-1 h-6 font-black"
                            style={{
                              background: '#F5F5F5',
                              fontFamily: 'inherit',
                              padding: '0.6em 1.3em',
                              fontWeight: '900',
                              fontSize: '12px',
                              border: '1.5px solid black',
                              borderRadius: '0.4em',
                              boxShadow: '0.1em 0.1em',
                              cursor: 'pointer',
                              transition: 'all 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translate(0, 0)';
                              e.currentTarget.style.boxShadow = '0.1em 0.1em';
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.transform = 'translate(0.05em, 0.05em)';
                              e.currentTarget.style.boxShadow = '0.05em 0.05em';
                            }}
                            onMouseUp={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onClick={async () => {
                              try {
                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                  await navigator.clipboard.writeText('9575658550');
                                } else {
                                  // Fallback for older browsers/mobile devices
                                  const textArea = document.createElement('textarea');
                                  textArea.value = '9575658550';
                                  textArea.style.position = 'fixed';
                                  textArea.style.left = '-999999px';
                                  textArea.style.top = '-999999px';
                                  document.body.appendChild(textArea);
                                  textArea.focus();
                                  textArea.select();
                                  document.execCommand('copy');
                                  document.body.removeChild(textArea);
                                }
                                toast({
                                  title: "Copied!",
                                  description: "Phone number copied to clipboard",
                                  className: "bg-neutral-300 text-black",
                                });
                              } catch (error) {
                                toast({
                                  title: "Copy Failed",
                                  description: "Please manually copy: 9575658550",
                                  className: "bg-red-300 text-black",
                                });
                              }
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex justify-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-black font-outfit text-xs px-3 py-1 font-black"
                            style={{
                              background: '#F5F5F5',
                              fontFamily: 'inherit',
                              padding: '0.6em 1.3em',
                              fontWeight: '900',
                              fontSize: '12px',
                              border: '1.5px solid black',
                              borderRadius: '0.4em',
                              boxShadow: '0.1em 0.1em',
                              cursor: 'pointer',
                              transition: 'all 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translate(0, 0)';
                              e.currentTarget.style.boxShadow = '0.1em 0.1em';
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.transform = 'translate(0.05em, 0.05em)';
                              e.currentTarget.style.boxShadow = '0.05em 0.05em';
                            }}
                            onMouseUp={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onClick={() => window.open('tel:+919575658550', '_self')}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-black font-outfit text-xs px-3 py-1 font-black"
                            style={{
                              background: '#F5F5F5',
                              fontFamily: 'inherit',
                              padding: '0.6em 1.3em',
                              fontWeight: '900',
                              fontSize: '12px',
                              border: '1.5px solid black',
                              borderRadius: '0.4em',
                              boxShadow: '0.1em 0.1em',
                              cursor: 'pointer',
                              transition: 'all 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translate(0, 0)';
                              e.currentTarget.style.boxShadow = '0.1em 0.1em';
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.transform = 'translate(0.05em, 0.05em)';
                              e.currentTarget.style.boxShadow = '0.05em 0.05em';
                            }}
                            onMouseUp={(e) => {
                              e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                              e.currentTarget.style.boxShadow = '0.15em 0.15em';
                            }}
                            onClick={() => window.open('https://wa.me/919575658550', '_blank')}
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Email Contact */}
              <div className="md:col-span-2 lg:col-span-1">
                <Card className="bg-gray-700 border-gray-600 w-full" style={{
                  background: '#FFC785',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(232, 244, 253, 0.3)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  height: '360px'
                }}>
                  <CardContent className="p-5 text-center">
                    <h3 className="text-2xl font-bold text-neutral-800 mb-2 font-outfit">Email Us</h3>
                                          <div className="flex items-center justify-center mb-2">
                        <Mail className="w-4 h-4 text-neutral-600 mr-3" />
                        <p className="text-sm text-neutral-500 font-outfit mr-2">deshmukhsunil266@gmail.com</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-black font-outfit text-xs px-2 py-1 h-6 font-black"
                          style={{
                            background: '#D4D4D4',
                            fontFamily: 'inherit',
                            padding: '0.6em 1.3em',
                            fontWeight: '900',
                            fontSize: '12px',
                            border: '1.5px solid black',
                            borderRadius: '0.4em',
                            boxShadow: '0.1em 0.1em',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                            e.currentTarget.style.boxShadow = '0.15em 0.15em';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translate(0, 0)';
                            e.currentTarget.style.boxShadow = '0.1em 0.1em';
                          }}
                          onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'translate(0.05em, 0.05em)';
                            e.currentTarget.style.boxShadow = '0.05em 0.05em';
                          }}
                          onMouseUp={(e) => {
                            e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                            e.currentTarget.style.boxShadow = '0.15em 0.15em';
                          }}
                          onClick={async () => {
                            try {
                              if (navigator.clipboard && navigator.clipboard.writeText) {
                                await navigator.clipboard.writeText('deshmukhsunil266@gmail.com');
                              } else {
                                // Fallback for older browsers/mobile devices
                                const textArea = document.createElement('textarea');
                                textArea.value = 'deshmukhsunil266@gmail.com';
                                textArea.style.position = 'fixed';
                                textArea.style.left = '-999999px';
                                textArea.style.top = '-999999px';
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();
                                document.execCommand('copy');
                                document.body.removeChild(textArea);
                              }
                              toast({
                                title: "Copied!",
                                description: "Email address copied to clipboard",
                                className: "bg-neutral-300 text-black",
                              });
                            } catch (error) {
                              toast({
                                title: "Copy Failed",
                                description: "Please manually copy: deshmukhsunil266@gmail.com",
                                className: "bg-red-300 text-black",
                              });
                            }
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input 
                          type="text" 
                          name="name"
                          placeholder="Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 text-sm font-black"
                          style={{
                            background: '#F5F5F5',
                            fontFamily: 'inherit',
                            padding: '0.6em 1.3em',
                            fontWeight: '900',
                            fontSize: '12px',
                            border: '1.5px solid black',
                            borderRadius: '0.4em',
                            boxShadow: '0.1em 0.1em',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease'
                          }}
                        />
                      </div>
                      
                      <div>
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 text-sm font-black"
                          style={{
                            background: '#F5F5F5',
                            fontFamily: 'inherit',
                            padding: '0.6em 1.3em',
                            fontWeight: '900',
                            fontSize: '12px',
                            border: '1.5px solid black',
                            borderRadius: '0.4em',
                            boxShadow: '0.1em 0.1em',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease'
                          }}
                        />
                      </div>
                      
                      <div>
                        <textarea 
                          name="message"
                          placeholder="Message"
                          rows={3}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 text-sm font-black resize-none"
                          style={{
                            background: '#F5F5F5',
                            fontFamily: 'inherit',
                            padding: '0.6em 1.3em',
                            fontWeight: '900',
                            fontSize: '12px',
                            border: '1.5px solid black',
                            borderRadius: '0.4em',
                            boxShadow: '0.1em 0.1em',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease'
                          }}
                        ></textarea>
                      </div>
                      
                      <Button 
                        type="submit"
                        variant="outline"
                        disabled={isSubmitting}
                        className="w-32 text-black font-outfit text-sm py-2 font-black"
                        style={{
                          background: isSubmitting ? '#A0A0A0' : '#D4D4D4',
                          fontFamily: 'inherit',
                          padding: '0.6em 1.3em',
                          fontWeight: '900',
                          fontSize: '12px',
                          border: '1.5px solid black',
                          borderRadius: '0.4em',
                          boxShadow: '0.1em 0.1em',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          transition: 'all 0.1s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                            e.currentTarget.style.boxShadow = '0.15em 0.15em';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translate(0, 0)';
                            e.currentTarget.style.boxShadow = '0.1em 0.1em';
                          }
                        }}
                        onMouseDown={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translate(0.05em, 0.05em)';
                            e.currentTarget.style.boxShadow = '0.05em 0.05em';
                          }
                        }}
                        onMouseUp={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translate(-0.05em, -0.05em)';
                            e.currentTarget.style.boxShadow = '0.15em 0.15em';
                          }
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 pt-8 border-t-2 border-gray-700">
              <p className="text-neutral-400 font-outfit">Deshmukh Properties © 2025. All Rights Reserved</p>
            </div>
          </div>
        </div>
      </section>
      <div className="[&_.toast-viewport]:bottom-0 [&_.toast-viewport]:left-0 [&_.toast-viewport]:right-0 [&_.toast-viewport]:top-auto [&_.toast-viewport]:md:bottom-auto [&_.toast-viewport]:md:right-4 [&_.toast-viewport]:md:top-4 [&_.toast-viewport]:md:left-auto">
        <Toaster />
      </div>
    </div>
  )
}
