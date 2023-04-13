import React, { useState, useEffect } from 'react';
import { FaAngleUp } from 'react-icons/fa';

function ScrollUpButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.pageYOffset > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      className={`scroll-up-button ${showButton ? 'scroll-up-button-show' : ''}`}
      onClick={handleClick}
    >
       <FaAngleUp className="up-icon" />
    </button>
  );
}

export default ScrollUpButton