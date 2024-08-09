import React from 'react';
import '../styles/LoadingPage.css';

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="background-animation"></div>
      <div className="content">
        <h1 className="title">The Makerspace</h1>
        <p className="subtitle">Is Coming To You Soon</p>
        <div className="gear-container">
          <div className="gear gear-1"></div>
          <div className="gear gear-2"></div>
          <div className="gear gear-3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;