import React, { useEffect, useState } from 'react';

const ComponentChecks = () => {
  const [screenSize, setScreenSize] = useState(getScreenSize());

  function getScreenSize() {
    const width = window.innerWidth;
    if (width < 640) return 'sm'; // Small screens (default mobile)
    if (width < 768) return 'md'; // Medium screens (tablets)
    if (width < 1024) return 'lg'; // Large screens (desktops)
    if (width < 1280) return 'xl'; // Extra large screens (large desktops)
    return '2xl'; // 2XL screens and above
  }

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener('resize', handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 p-2 bg-white shadow-md rounded-lg z-50">
      <p className="text-lg font-semibold">
        Current Screen Size: <span className="text-blue-500">{screenSize}</span>
      </p>
    </div>
  );
};

export default ComponentChecks;
