import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./JournalHero.css";

// No need to import CarouselImages anymore

export default function JournalHero() {
    // State for background image rotation
    const [backgroundIndex, setBackgroundIndex] = useState(0);

    // Use reliable Unsplash images that will definitely work
    const backgroundImages = [
        "https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=800&q=60"
    ];

    // Rotate background images every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundIndex((prevIndex) =>
                (prevIndex + 1) % backgroundImages.length
            );
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    // Animation variants for staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section className="journal-hero">
            {/* Background Image with crossfade effect */}
            {backgroundImages.map((image, index) => (
                <div
                    key={index}
                    className="journal-hero__background"
                    style={{
                        backgroundImage: `url('${image}')`,
                        opacity: index === backgroundIndex ? 1 : 0,
                        transition: "opacity 1.5s ease-in-out"
                    }}
                />
            ))}

            {/* Overlay */}
            <div className="journal-hero__overlay"></div>

            {/* Hero Content with staggered animations */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="journal-hero__content"
            >
<motion.h1
                    variants={itemVariants}
                    className="journal-hero__title"
                >
                    Explore Cutting-Edge Research from International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME)
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="journal-hero__description"
                >
                    Stay informed with the latest academic breakthroughs and innovative discoveries
                    that shape the future of education and research.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="journal-hero__buttons"
                >
                    <Link
                        to="/journals"
                        className="journal-hero__button-primary"
                    >
                        Browse Journals
                    </Link>
                    <Link
                        to="/submission"
                        className="journal-hero__button-secondary"
                    >
                        Submit Your Research
                    </Link>
                </motion.div>

                <div className="journal-hero__badge">
                    Peer-Reviewed
                </div>
            </motion.div>
        </section>
    );
}
