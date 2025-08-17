import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { userStorage } from '../utils/security';
import './Sidebar.css';

// Check if we're on a mobile device
const isMobile = () => window.innerWidth <= 768;

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');
  const [user, setUser] = useState(null);
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    // Set active link based on current path
    setActiveLink(location.pathname);

    // Get user from secure storage if available
    const storedUser = userStorage.get();
    if (storedUser) {
      setUser(storedUser);
    }

    // Handle window resize for responsive behavior
    const handleResize = () => {
      setMobile(isMobile());
    };

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  return (
    <div className={`sidebar ${className || ''} ${mobile ? 'mobile' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <img src="/images/logo.png" alt="Sahara Journal Logo" className="sidebar-logo-img" />
          <h2 className="sidebar-title">Sahara Journal</h2>
        </Link>
        {mobile && (
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link
              to="/"
              className={`sidebar-menu-link ${activeLink === '/' ? 'active' : ''}`}
            >
              <i className="fas fa-home sidebar-icon"></i>
              <span>Home</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/journals"
              className={`sidebar-menu-link ${activeLink.includes('/journals') ? 'active' : ''}`}
            >
              <i className="fas fa-book-open sidebar-icon"></i>
              <span>Journals</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/about"
              className={`sidebar-menu-link ${activeLink === '/about' ? 'active' : ''}`}
            >
              <i className="fas fa-info-circle sidebar-icon"></i>
              <span>About</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/guide"
              className={`sidebar-menu-link ${activeLink === '/guide' ? 'active' : ''}`}
            >
              <i className="fas fa-question-circle sidebar-icon"></i>
              <span>Author Guide</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/contact"
              className={`sidebar-menu-link ${activeLink === '/contact' ? 'active' : ''}`}
            >
              <i className="fas fa-envelope sidebar-icon"></i>
              <span>Contact</span>
            </Link>
          </li>

          {/* Admin menu items */}
          <>
            <li className="sidebar-menu-divider">Admin</li>
            <li className="sidebar-menu-item">
              <Link
                to="/manage-journals"
                className={`sidebar-menu-link ${activeLink === '/manage-journals' ? 'active' : ''}`}
              >
                <i className="fas fa-tasks sidebar-icon"></i>
                <span>Manage Journals</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link
                to="/journals/uploads"
                className={`sidebar-menu-link ${activeLink === '/journals/uploads' ? 'active' : ''}`}
              >
                <i className="fas fa-upload sidebar-icon"></i>
                <span>Upload Journals</span>
              </Link>
            </li>
          </>

          {/* User menu items */}
          {user ? (
            <>
              <li className="sidebar-menu-divider">Account</li>
              <li className="sidebar-menu-item">
                <Link
                  to="/submission"
                  className={`sidebar-menu-link ${activeLink === '/submission' ? 'active' : ''}`}
                >
                  <i className="fas fa-paper-plane sidebar-icon"></i>
                  <span>Submit Journal</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link
                  to="/dashboard"
                  className={`sidebar-menu-link ${activeLink === '/dashboard' ? 'active' : ''}`}
                >
                  <i className="fas fa-tachometer-alt sidebar-icon"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link
                  to="/logout"
                  className="sidebar-menu-link"
                >
                  <i className="fas fa-sign-out-alt sidebar-icon"></i>
                  <span>Logout</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="sidebar-menu-divider">Account</li>
              <li className="sidebar-menu-item">
                <Link
                  to="/login"
                  className={`sidebar-menu-link ${activeLink === '/login' ? 'active' : ''}`}
                >
                  <i className="fas fa-sign-in-alt sidebar-icon"></i>
                  <span>Login</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link
                  to="/register"
                  className={`sidebar-menu-link ${activeLink === '/register' ? 'active' : ''}`}
                >
                  <i className="fas fa-user-plus sidebar-icon"></i>
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p>&copy; {new Date().getFullYear()} Sahara Journal</p>
      </div>
    </div>
  );
};

export default Sidebar;
