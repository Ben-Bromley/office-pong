import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingSpinnerScreen: React.FC = () => {
  return (
    <main>
      <div className="h-screen w-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    </main>
  );
};

export default LoadingSpinnerScreen;
