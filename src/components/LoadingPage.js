import React from 'react';
import '../styles/LoadingPage.css';

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="loading-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
        </div>
        <p className="loading-text">Page loading</p>
      </div>
    </div>
  );
};

export default LoadingPage;