import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with the editorial team</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-section">
            <h3>Contact Information</h3>
            <p>
              <i className="fas fa-phone-alt"></i>
              <a href="tel:+2348138614901">+234 813 861 4901</a>
            </p>
            <p>
              <i className="fas fa-envelope"></i>
              <a href="mailto:contact@njosteme.org">contact@njosteme.org</a>
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i>
              <span>Jos, Plateau State, Nigeria</span>
            </p>
          </div>

          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-telegram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h3>Message to Editor</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
