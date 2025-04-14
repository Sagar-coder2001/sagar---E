import React, { useEffect } from 'react';

const ScrollTop = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth',  // Smooth scrolling effect
    });
  }, []); // Empty dependency array ensures it runs only once after mount

  return (
    <div>
      {/* This component will automatically scroll to the top when rendered */}
    </div>
  );
}

export default ScrollTop;
