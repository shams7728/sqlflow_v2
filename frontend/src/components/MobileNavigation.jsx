import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  TrophyIcon,
  BeakerIcon,
  AcademicCapIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  TrophyIcon as TrophyIconSolid,
  BeakerIcon as BeakerIconSolid,
  AcademicCapIcon as AcademicCapIconSolid
} from '@heroicons/react/24/solid';

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      path: '/dashboard',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
      color: 'text-blue-600'
    },
    {
      id: 'lessons',
      label: 'Lessons',
      path: '/lessons',
      icon: BookOpenIcon,
      activeIcon: BookOpenIconSolid,
      color: 'text-green-600'
    },
    {
      id: 'practice',
      label: 'Practice',
      path: '/practice',
      icon: BeakerIcon,
      activeIcon: BeakerIconSolid,
      color: 'text-purple-600'
    },
    {
      id: 'achievements',
      label: 'Awards',
      path: '/achievements',
      icon: TrophyIcon,
      activeIcon: TrophyIconSolid,
      color: 'text-yellow-600'
    },
    {
      id: 'interview',
      label: 'Interview',
      path: '/sql-interview-preparation',
      icon: AcademicCapIcon,
      activeIcon: AcademicCapIconSolid,
      color: 'text-orange-600'
    }
  ];

  // Auto-hide navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (path) => {
    // Haptic feedback for supported devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    navigate(path);
  };

  return (
    <div 
      className={`mobile-nav md:hidden transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`mobile-nav-item touch-target relative transition-all duration-200 ${
              isActive ? 'active' : ''
            }`}
            aria-label={item.label}
            style={{
              transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Active indicator */}
            {isActive && (
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                }}
              />
            )}
            
            {/* Icon with animation */}
            <div className={`relative transition-all duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <Icon 
                className={`mobile-nav-icon transition-colors duration-200 ${
                  isActive ? item.color : 'text-gray-500'
                }`} 
              />
              
              {/* Pulse effect for active item */}
              {isActive && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-500" />
              )}
            </div>
            
            {/* Label */}
            <span 
              className={`text-xs font-medium transition-all duration-200 ${
                isActive ? `font-semibold ${item.color}` : 'text-gray-500'
              }`}
            >
              {item.label}
            </span>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className="ripple-effect" />
            </div>
          </button>
        );
      })}
      
      {/* Floating Action Button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={() => navigate('/practice')}
          aria-label="Quick Practice"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;