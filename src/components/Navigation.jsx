import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "./Navigation.css";

const Navigation = ({ user, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoPath = "/images/logo.JPG";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Main navigation links - simplified for better horizontal layout
  const mainNavLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/journals", label: "Journals" },
    { to: "/submission", label: "Submit" },
    { to: "/archive", label: "Archive" },
    { to: "/about", label: "About" },
    { to: "/guide", label: "Guide" },
    { to: "/contact", label: "Contact" },
    { to: "/manage-journals", label: "Manage" },
    { to: "/journals/uploads", label: "Upload" }
  ];

  // User navigation links
  const userNavLinks = user ? [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/updateprofile", label: "Profile" },
    { to: "/logout", label: "Logout" }
  ] : [
    { to: "/register", label: "Register" },
    { to: "/login", label: "Login" }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="logo-section">
          <NavLink to="/" className="logo-link">
            <img src={logoPath} alt="Journal Logo" className="logo-image" />
            <div className="logo-text">
              <span className="logo-title">IJIRSTME</span>
              <span className="logo-subtitle">International Journal</span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="nav-menu">
            <div className="nav-links-container">
              {mainNavLinks.map((link) => (
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
            </div>
            
            <div className="user-section">
              {userNavLinks.map((link) => (
                <NavLink 
                  key={link.to} 
                  to={link.to} 
                  className={({ isActive }) => 
                    `user-link ${isActive ? 'active' : ''}`
                  }
                >
                  {link.label}
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
            
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16m-7 6h7"/>
              </svg>
            </button>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobile && (
          <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-menu">
              <div className="mobile-menu-header">
                <h3>Menu</h3>
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
                <div className="mobile-main-links">
                  {mainNavLinks.map((link) => (
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
                
                <div className="mobile-user-links">
                  {userNavLinks.map((link) => (
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;