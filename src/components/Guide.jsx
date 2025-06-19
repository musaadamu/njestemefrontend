import React from 'react';
import './Guide.css';

const Guide = () => {
  return (
    <div className="guide-container">
      <h1>Author's Guide</h1>
      <p className="guide-intro">Guidelines for submitting to the COELSN Journal of Interdisciplinary Academic Research and Development</p>

      <section className="guide-section">
        <h2>Manuscript Preparation</h2>
        <ul>
          <li>Submit manuscripts in Microsoft Word format (.doc or .docx)</li>
          <li>Use Times New Roman, 12-point font</li>
          <li>Double-space all text, including references</li>
          <li>Include page numbers on all pages</li>
          <li>Manuscripts should typically be between 4,000-8,000 words</li>
          <li>Include appropriate figures, tables, and illustrations as needed</li>
          <li>Ensure all research complies with ethical standards in your field</li>
        </ul>
      </section>

      <section className="guide-section">
        <h2>Structure</h2>
        <ol>
          <li>Title Page (title, authors, affiliations, contact information)</li>
          <li>Abstract (250 words maximum)</li>
          <li>Keywords (4-6 words)</li>
          <li>Introduction</li>
          <li>Literature Review</li>
          <li>Theoretical Framework (if applicable)</li>
          <li>Methodology</li>
          <li>Results</li>
          <li>Discussion</li>
          <li>Conclusion and Recommendations</li>
          <li>Acknowledgments (if applicable)</li>
          <li>References</li>
          <li>Appendices (if applicable)</li>
        </ol>
      </section>

      <section className="guide-section">
        <h2>Research Areas</h2>
        <p>The journal welcomes submissions from various disciplines including but not limited to:</p>
        <div className="research-areas">
          <div className="area-column">
            <h3>Social Sciences</h3>
            <ul>
              <li>Education</li>
              <li>Psychology</li>
              <li>Sociology</li>
              <li>Economics</li>
              <li>Political Science</li>
            </ul>
          </div>
          <div className="area-column">
            <h3>Natural Sciences</h3>
            <ul>
              <li>Biology</li>
              <li>Chemistry</li>
              <li>Physics</li>
              <li>Environmental Science</li>
              <li>Mathematics</li>
            </ul>
          </div>
          <div className="area-column">
            <h3>Technology & Innovation</h3>
            <ul>
              <li>Computer Science</li>
              <li>Information Technology</li>
              <li>Engineering</li>
              <li>Artificial Intelligence</li>
              <li>Biotechnology</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <h2>Citation Style</h2>
        <p>Use APA 7th edition for all citations and references.</p>
        <div className="example-box">
          <h3>Example Citation:</h3>
          <p>Smith, J. D., & Johnson, M. K. (2023). Title of the article. Journal Name, 15(2), 123-145.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>Submission Process</h2>
        <div className="process-steps">
          <div className="step">
            <span className="step-number">1</span>
            <p>Register an account</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>Prepare manuscript</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <p>Submit online</p>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <p>Track progress</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide;
