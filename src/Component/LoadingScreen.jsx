
import React from 'react';
import './LoadingScreen.css'; // We will create this CSS file next

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Loading content...</p>
    </div>
  );
};

export default LoadingScreen;
