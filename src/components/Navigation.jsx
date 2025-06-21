import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "./Navigation.css";

const Navigation = ({ user, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); // Increased breakpoint
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoPath = "/images/logo.JPG";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Increased breakpoint
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Core navigation links - prioritized and condensed
  const coreNavLinks = [
    { to: "/", label: "Home", priority: 1 },
    { to: "/journals", label: "Journals", priority: 2 },
    { to: "/submission", label: "Submit", priority: 3 },
    { to: "/editorial-board", label: "Editorial", priority: 4 },
    { to: "/about", label: "About", priority: 5 }
  ];

  // Secondary navigation links - shown in dropdown
  const secondaryNavLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/archive", label: "Archive" },
    { to: "/guide", label: "Guide" },
    { to: "/contact", label: "Contact" },
    { to: "/manage-journals", label: "Manage" },
    { to: "/journals/uploads", label: "Upload" }
  ];

  // User navigation links - always visible
  const userNavLinks = user ? [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/updateprofile", label: "Profile", icon: "👤" },
    { to: "/logout", label: "Logout", icon: "🚪" }
  ] : [
    { to: "/register", label: "Register", icon: "📝" },
    { to: "/login", label: "Login", icon: "🔑" }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo Section - Optimized */}
        <div className="logo-section">
          <NavLink to="/" className="logo-link">
            <img src={logoPath} alt="IJIRSTME" className="logo-image" />
            <div className="logo-text">
              <span className="logo-title">IJIRSTME</span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="nav-menu">
            {/* Core Navigation Links */}
            <div className="nav-links-container">
              {coreNavLinks.map((link) => (
                <NavLink 
                  key={link.to} 
                  to={link.to} 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              {/* More Dropdown */}
              <div className="dropdown-container">
                <button className="dropdown-trigger">
                  More <span className="dropdown-arrow">▼</span>
                </button>
                <div className="dropdown-menu">
                  {secondaryNavLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="dropdown-link"
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            
            {/* User Section - Always Visible */}
            <div className="user-section">
              {userNavLinks.map((link) => (
                <NavLink 
                  key={link.to} 
                  to={link.to} 
                  className={({ isActive }) => 
                    `user-link ${isActive ? 'active' : ''}`
                  }
                  title={link.label}
                >
                  <span className="user-link-icon">{link.icon}</span>
                  <span className="user-link-text">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="mobile-nav">
            <button
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            
            {toggleSidebar && (
              <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16m-7 6h7"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobile && (
          <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-menu">
              <div className="mobile-menu-header">
                <h3>Navigation</h3>
                <button
                  className="close-button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <div className="mobile-links">
                <div className="mobile-section">
                  <h4>Main Navigation</h4>
                  {[...coreNavLinks, ...secondaryNavLinks].map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="mobile-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
                
                <div className="mobile-divider"></div>
                
                <div className="mobile-section">
                  <h4>Account</h4>
                  {userNavLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="mobile-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-link-icon">{link.icon}</span>
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;