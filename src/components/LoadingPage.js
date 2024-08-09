import React, { useEffect, useState } from 'react';
import '../styles/LoadingPage.css';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-page">
      <div className="loading-content">
        <h1>Welcome to the Makerspace</h1>
        <p>Where innovation comes to life</p>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="progress-text">{progress}% Loaded</p>
      </div>
      
      <div className="loading-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
};

export default LoadingPage;