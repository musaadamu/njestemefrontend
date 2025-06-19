import React from 'react';
import './Carousel.css';

const Carousel = () => {
  return (
    <div className="w-75 mx-auto">
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-inner">
          {/* Slide 1 */}
          <div className="carousel-item active">
            <img
              src="/images/image2.JPG.JPG"
              className="d-block w-100 carousel-img"
              alt="STEM Education Research"
            />
            <div className="carousel-caption-new">
              <h5>Advancing STEM Education Research</h5>
              <p>Leading research in science and mathematics education</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="/images/image5.JPG.JPG"
              className="d-block w-100 carousel-img"
              alt="Academic Excellence"
            />
            <div className="carousel-caption-new">
              <h5>Fostering Academic Excellence</h5>
              <p>Promoting quality research and innovation</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="/images/image4.JPG.JPG"
              className="d-block w-100 carousel-img"
              alt="Educational Innovation"
            />
            <div className="carousel-caption-new">
              <h5>Driving Educational Innovation</h5>
              <p>Advancing teaching and learning methodologies</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="/images/image5.JPG.JPG"
              className="d-block w-100 carousel-img"
              alt="Research Community"
            />
            <div className="carousel-caption-new">
              <h5>Building Research Community</h5>
              <p>Fostering collaboration in STEM education</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="/images/image4.JPG.JPG"
              className="d-block w-100 carousel-img"
              alt="Future of Education"
            />
            <div className="carousel-caption-new">
              <h5>Shaping the Future of Education</h5>
              <p>Innovating STEM education in Nigeria</p>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
