import React, { useState, useEffect } from 'react';

const ImageTest = () => {
  const [imageStatus, setImageStatus] = useState({});
  
  const images = [
    { id: 1, src: '/images/image1.JPG.JPG', alt: 'Image 1' },
    { id: 2, src: '/images/image2.JPG.JPG', alt: 'Image 2' },
    { id: 3, src: '/images/image3.JPG.JPG', alt: 'Image 3' },
    { id: 4, src: '/images/image4.JPG.JPG', alt: 'Image 4' },
    { id: 5, src: '/images/image5.JPG.JPG', alt: 'Image 5' }
  ];
  
  // Process image paths for production
  const processImagePath = (path) => {
    if (process.env.NODE_ENV === 'production') {
      const publicUrl = process.env.PUBLIC_URL || '';
      return `${publicUrl}${path}`;
    }
    return path;
  };
  
  const handleImageLoad = (id) => {
    setImageStatus(prev => ({
      ...prev,
      [id]: 'loaded'
    }));
    console.log(`Image ${id} loaded successfully`);
  };
  
  const handleImageError = (id, e) => {
    setImageStatus(prev => ({
      ...prev,
      [id]: 'error'
    }));
    console.error(`Image ${id} failed to load:`, e.target.src);
  };
  
  useEffect(() => {
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      PUBLIC_URL: process.env.PUBLIC_URL
    });
  }, []);
  
  return (
    <div className="image-test-container" style={{ padding: '20px' }}>
      <h2>Image Test Component</h2>
      <p>This component tests if images are loading correctly.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {images.map(image => (
          <div key={image.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>Image {image.id}</h3>
            <div style={{ position: 'relative', height: '200px', backgroundColor: '#f0f0f0' }}>
              <img
                src={processImagePath(image.src)}
                alt={image.alt}
                onLoad={() => handleImageLoad(image.id)}
                onError={(e) => handleImageError(image.id, e)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  position: 'relative',
                  zIndex: 2
                }}
              />
              {imageStatus[image.id] === 'error' && (
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  color: 'red',
                  zIndex: 3
                }}>
                  Failed to load image
                </div>
              )}
            </div>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              <p>Path: {processImagePath(image.src)}</p>
              <p>Status: {imageStatus[image.id] || 'loading...'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;
