import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaResearchgate, FaOrcid, FaMapMarkerAlt, FaPhone, FaChevronRight } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import "./Footer.css";
import "./NewFooter.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="professional-footer site-footer">
      {/* Footer Top Section */}
      <div className="footer-top">
        <div className="footer-container">
          {/* Top Row with Logo and Description */}
          <div className="footer-top-row">
            <div className="footer-logo">
              <img src="/images/logo.JPG" alt="IJIRSTME Journal Logo" />
              <div className="footer-logo-text">
                <h3>IJIRSTME Journal</h3>
              </div>
            </div>
            <p className="footer-description">
              Advancing interdisciplinary academic research and development across multiple fields.
              A trusted platform for innovative scholarly communication.
            </p>
          </div>

          {/* Main Content Row - Multi-column Layout */}
          <div className="footer-main-content">
            {/* Column 1: Contact Info */}
            <div className="footer-section">
              <h4>Contact Us</h4>
              <div className="footer-contact">
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>123 Academic Ave, Nigeria</span>
                </div>
                <div className="contact-item">
                  <FaPhone />
                  <span>+234 123 456 7890</span>
                </div>
                <div className="contact-item">
                  <FiMail />
                  <span>contact@coelsn-journal.org</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-section">
              <h4>Quick Links</h4>
              <div className="links-grid">
                <ul className="footer-links">
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/journals">Browse Journals</Link>
                  </li>
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/submission">Submit Research</Link>
                  </li>
                </ul>
                <ul className="footer-links">
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/contact">Contact</Link>
                  </li>
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/faq">FAQs</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3: Resources */}
            <div className="footer-section">
              <h4>Resources</h4>
              <div className="links-grid">
                <ul className="footer-links">
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/author-guidelines">Author Guidelines</Link>
                  </li>
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/peer-review">Peer Review</Link>
                  </li>
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/open-access">Open Access</Link>
                  </li>
                </ul>
                <ul className="footer-links">
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/citation-metrics">Citation Metrics</Link>
                  </li>
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/ethics">Publication Ethics</Link>
                  </li>
                  <li>
                    <FaChevronRight className="link-icon" />
                    <Link to="/copyright">Copyright</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Connect and Subscribe */}
            <div className="footer-section">
              <h4>Connect With Us</h4>
              <div className="social-icons">
                <a href="#" aria-label="Facebook" className="social-icon">
                  <FaFacebook />
                </a>
                <a href="#" aria-label="Twitter" className="social-icon">
                  <FaTwitter />
                </a>
                <a href="#" aria-label="LinkedIn" className="social-icon">
                  <FaLinkedin />
                </a>
                <a href="#" aria-label="ResearchGate" className="social-icon">
                  <FaResearchgate />
                </a>
                <a href="#" aria-label="ORCID" className="social-icon">
                  <FaOrcid />
                </a>
                <a href="mailto:contact@coelsn-journal.org" aria-label="Email" className="social-icon">
                  <FiMail />
                </a>
              </div>

              <div className="newsletter">
                <h5>Subscribe to Newsletter</h5>
                <div className="newsletter-form">
                  <input type="email" placeholder="Email Address" />
                  <button type="submit">Go</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section - Two Lines */}
      <div className="footer-bottom">
        <div className="footer-container">
          {/* Top Line - Copyright and ISSN */}
          <div className="footer-bottom-top">
            <div className="copyright">
              <p>&copy; {currentYear} International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME) </p>
            </div>
            <div className="footer-info">
              <p>ISSN: <span className="issn">1234-5678</span> (Online) | <span className="issn">8765-4321</span> (Print)</p>
            </div>
          </div>

          {/* Bottom Line - Legal Links */}
          <div className="footer-bottom-bottom">
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Use</Link>
              <Link to="/copyright">Copyright</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
