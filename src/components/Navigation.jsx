import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "./Navigation.css";

const Navigation = ({ user, toggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoPath = "/images/logo.JPG";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Main navigation links with formatted labels for proper alignment
  const mainNavLinks = [
    { to: "/", label: "Home", topLine: "Home", bottomLine: "" },
    { to: "/journals", label: "Journals", topLine: "Journals", bottomLine: "" },
    { to: "/submission", label: "Submit Journal", topLine: "Submit", bottomLine: "Journal" },
    { to: "/archive", label: "Archive", topLine: "Archive", bottomLine: "" },
    { to: "/about", label: "About Us", topLine: "About", bottomLine: "Us" },
    { to: "/guide", label: "Author's Guide", topLine: "Author's", bottomLine: "Guide" },
    { to: "/contact", label: "Contact", topLine: "Contact", bottomLine: "" },
    { to: "/manage-journals", label: "Manage Journals", topLine: "Manage", bottomLine: "Journals" },
    { to: "/journals/uploads", label: "Journal Upload", topLine: "Upload", bottomLine: "Journal" }
  ];

  // User navigation links with formatted labels for proper alignment
  const userNavLinks = user ? [
    { to: "/dashboard", label: "Dashboard", topLine: "Dashboard", bottomLine: "" },
    { to: "/updateprofile", label: "Profile", topLine: "Profile", bottomLine: "" },
    { to: "/logout", label: "Logout", topLine: "Logout", bottomLine: "" }
  ] : [
    { to: "/register", label: "Register", topLine: "Register", bottomLine: "" },
    { to: "/login", label: "Login", topLine: "Login", bottomLine: "" }
  ];

  return (
    <nav className={`modern-navigation ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-logo-section">
          <NavLink to="/" className="logo-link">
            <img
              src={logoPath}
              alt="NJESTEME Journal Logo"
              className="nav-logo-image"
            />
            <div className="logo-text">
<span className="logo-title">NJOSTEME</span>
<span className="logo-subtitle">NJOSTEME</span>
            </div>
          </NavLink>
        </div>

        {isMobile ? (
            <div className="nav-mobile-buttons">
              <button
                className="menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              </button>
              <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16m-7 6h7"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="nav-menu">
              <div className="main-nav-links">
                {mainNavLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className="nav-link">
                    <div className="nav-text-container">
                      <span className="nav-text-top">{link.topLine}</span>
                      {link.bottomLine && <span className="nav-text-bottom">{link.bottomLine}</span>}
                    </div>
                  </NavLink>
                ))}
              </div>
              <div className="user-nav-links">
                {userNavLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className="user-link">
                    <div className="nav-text-container">
                      <span className="nav-text-top">{link.topLine}</span>
                      {link.bottomLine && <span className="nav-text-bottom">{link.bottomLine}</span>}
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

        {isMobile && (
          <div className={`nav-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <button
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="mobile-links">
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
              <div className="mobile-divider"></div>
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
        )}

        {isMobile && (
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
