import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME)</h1>
        <p className="subtitle">Advancing Research in STEM Education</p>
      </div>

      <section className="about-section">
        <div className="vision-mission">
          <div className="vision">
            <h3>Vision</h3>
            <p>To be a leading international journal promoting excellence in science, technology, engineering, and mathematics education research and innovation.</p>
          </div>
          <div className="mission">
            <h3>Mission</h3>
            <p>To publish high-quality, peer-reviewed research that contributes to the advancement of STEM education, fostering innovation and excellence in teaching and learning practices across global contexts.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About the Journal</h2>
        <div className="institution-content">
          <div>
            <p>International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME) is a premier peer-reviewed academic journal focused on advancing research in science, technology, engineering, and mathematics education. Our journal serves as a platform for sharing innovative research, teaching methodologies, and best practices in STEM education.</p>
            <p>Our international editorial board comprises distinguished scholars and practitioners from leading institutions worldwide, ensuring rigorous academic standards and diverse perspectives in STEM education research.</p>
          </div>
          <div className="contact-details">
            <h3>Contact Information</h3>
            <p>Location: Federal College of Education Technical Potiskum Yobe State</p>
            <p>Email: contact@ijirstme.org</p>
            <p>Phone: +234 8138614901</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Journal Details</h2>
        <div className="journal-details">
          <div className="detail-card">
            <h3>Publication Frequency</h3>
            <p>Quarterly (4 issues per year)</p>
          </div>
          <div className="detail-card">
            <h3>Peer Review Process</h3>
            <p>Double-blind peer review by STEM education experts</p>
          </div>
          <div className="detail-card">
            <h3>Open Access</h3>
            <p>Full open access with immediate online publication</p>
          </div>
          <div className="detail-card">
            <h3>Publication Ethics</h3>
            <p>Adherence to international publication standards and ethics</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Research Focus Areas</h2>
        <div className="journal-details">
          <div className="detail-card">
            <h3>Science Education</h3>
            <p>Biology, Chemistry, Physics, Environmental Science Education</p>
          </div>
          <div className="detail-card">
            <h3>Technology Education</h3>
            <p>Computer Science Education, Digital Learning, EdTech Innovation</p>
          </div>
          <div className="detail-card">
            <h3>Engineering Education</h3>
            <p>Engineering Pedagogy, Project-Based Learning, Design Education</p>
          </div>
          <div className="detail-card">
            <h3>Mathematics Education</h3>
            <p>Mathematical Pedagogy, Problem-Solving, Numeracy Skills</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Location</h2>
        <div className="location-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.964964357751!2d11.031963!3d11.713964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10f4c7e2e2e2e2e3%3A0x7e2e2e2e2e2e2e2e!2sFederal%20College%20of%20Education%20(Technical)%20Potiskum!5e0!3m2!1sen!2sng!4v1701876008045!5m2!1sen!2sng"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Federal College of Education Technical Potiskum Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default About;
