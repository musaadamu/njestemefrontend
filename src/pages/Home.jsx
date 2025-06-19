import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import JournalList from "../components/JournalList.jsx";
// import JournalHero from "../components/JournalHero.jsx";
import './Home.css';
import Carousel from "../components/Carousel.jsx";
import './WelcomeSection.css'; // Import the new CSS file
import './FeaturedArticles.css'; // Import the new CSS file
// Bootstrap CSS is now imported globally

// No need to import CarouselImages anymore

export default function HomePage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);    // Define carousel images
    const carouselImages = [
        {
            src: "/images/image1.JPG.JPG",
            alt: "STEM Education Research",
            title: "Advancing STEM Education",
            description: "Leading research in science, technology, engineering, and mathematics education"
        },
        {
            src: "/images/image2.JPG.JPG",
            alt: "Academic Excellence",
            title: "Research Excellence",
            description: "Fostering quality research and academic advancement"
        },
        {
            src: "/images/image3.JPG.JPG",
            alt: "Educational Innovation",
            title: "Innovation in Education",
            description: "Driving innovation in STEM education methodologies"
        },
        {
            src: "/images/image4.JPG.JPG",
            alt: "Research Community",
            title: "Building Community",
            description: "Creating a vibrant research community in STEM education"
        },
        {
            src: "/images/image5.JPG.JPG",
            alt: "Future of Education",
            title: "Shaping the Future",
            description: "Advancing the future of STEM education in Nigeria"
        }
    ];

    return (
        <div className="home-container">
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <div className="main-container">
                    <main className="main-content">
                        {/* Journal Title */}
                        <div className="journal-title-container">
                            <h1 className="journal-main-title">International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME)</h1>
                        </div>

                        {/* Carousel Caption Section */}
                        <div className="carousel-caption-container">
                            <div className="carousel-caption-box">
                                <h2>{carouselImages[activeIndex].title}</h2>
                                <p>{carouselImages[activeIndex].description}</p>
                            </div>
                        </div>

                        {/* Carousel Section */}
                        <div className="home-carousel-wrapper">
                            <Carousel
                                images={carouselImages}
                                height={isMobile ? 300 : 500}
                                autoplaySpeed={4000}
                                showTitle={false}
                                activeIndex={activeIndex}
                                setActiveIndex={setActiveIndex}
                            />
                        </div>

                        {/* <JournalHero /> */}

                        {/* Welcome Section - Modern Design */}
                        <div className="welcome-section">
                            <div className="welcome-content">
                                <h1 className="welcome-heading">
                                    Welcome to the <span>International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME)</span>
                                </h1>
                                <p className="welcome-subheading">
                                    A platform dedicated to advancing research and innovation in science, technology, engineering, and mathematics education.
                                </p>
                                <div className="welcome-actions">
                                    <Link to="/submission" className="welcome-button primary">
                                        Submit Your Manuscript
                                    </Link>
                                    <Link to="/about" className="welcome-button secondary">
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                            <div className="welcome-stats">
                                <div className="stat-item">
                                    <span className="stat-number">100+</span>
                                    <span className="stat-label">Published Articles</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">50+</span>
                                    <span className="stat-label">Expert Reviewers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">12</span>
                                    <span className="stat-label">Research Fields</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">4</span>
                                    <span className="stat-label">Issues Per Year</span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Articles Section */}
                        <div className="featured-articles-section">
                            <h1 className="featured-title">Featured Articles</h1>
                            <p className="featured-subtitle">Discover the latest research from International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME)</p>
                            <div className="search-bar">
                                <input type="text" className="search-input" placeholder="Search articles by keyword, title, author..." />
                            </div>
                            <div className="filter-section">
                                <span className="filter-item active">All</span>
                                <span className="filter-item">Science</span>
                                <span className="filter-item">Technology</span>
                                <span className="filter-item">Engineering</span>
                                <span className="filter-item">Mathematics</span>
                            </div>
                            <JournalList />
                            <div className="no-results">No journals found matching your criteria.</div>
                            <Link to="/journals" className="view-all-button">View All Articles →</Link>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
