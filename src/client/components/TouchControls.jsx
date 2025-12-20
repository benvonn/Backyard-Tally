// TouchButton.jsx
import React, { useRef, useEffect, useState } from 'react';

export default function TouchButton({ 
  onSingleTap, 
  onDoubleTap,
  children,
  style = {}, // Accept style prop
  bagIn,    // If unused, consider removing
  bagOn     // If unused, consider removing
}) {
  const buttonRef = useRef(null);
  // Add a state to track if the button is currently disabled due to debouncing
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    let touchCount = 0;
    let touchStart = null;

    // Define the debounce delay (e.g., 300 milliseconds)
    const DEBOUNCE_DELAY = 300; // Adjust this value as needed

    const handleTouchStart = (e) => {
      if (isDisabled) {
        e.preventDefault(); // Prevent interaction if disabled
        return;
      }
      touchCount = e.touches.length;
      touchStart = Date.now();
    };

    const handleTouchEnd = (e) => {
      if (isDisabled) {
        e.preventDefault(); // Prevent interaction if disabled
        return;
      }

      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStart;
      
      if (touchDuration < 500 && touchStart !== null) {
        let handler = null;
        if (touchCount === 1) {
          handler = onSingleTap;
        } else if (touchCount === 2) {
          handler = onDoubleTap;
        }

        if (handler) {
          // Disable the button
          setIsDisabled(true);
          
          // Call the handler
          handler?.();

          // Re-enable the button after the delay
          setTimeout(() => {
            setIsDisabled(false);
          }, DEBOUNCE_DELAY);
        }
      }
      
      touchCount = 0;
      touchStart = null;
    };

    const handleTouchMove = (e) => {
      if (isDisabled) {
        e.preventDefault(); // Prevent interaction if disabled
        return;
      }
      touchCount = e.touches.length;
    };

    const handleTouchCancel = (e) => {
      if (isDisabled) {
        e.preventDefault(); // Prevent interaction if disabled
        return;
      }
      touchCount = 0;
      touchStart = null;
    };

    // Mouse fallback events
    const handleMouseDown = (e) => {
      if (isDisabled) {
        e.preventDefault(); // Prevent interaction if disabled
        return;
      }
      // Simulate single tap on mouse down for fallback
      // Disable the button
      setIsDisabled(true);
      onSingleTap?.();
      // Re-enable the button after the delay
      setTimeout(() => {
        setIsDisabled(false);
      }, DEBOUNCE_DELAY);
    };

    const handleDoubleClick = (e) => {
      if (isDisabled) {
        e.preventDefault(); // Prevent interaction if disabled
        return;
      }
      // Simulate double tap on double click for fallback
      // Disable the button
      setIsDisabled(true);
      onDoubleTap?.();
      // Re-enable the button after the delay
      setTimeout(() => {
        setIsDisabled(false);
      }, DEBOUNCE_DELAY);
    };

    // Add event listeners
    button.addEventListener('touchstart', handleTouchStart, { passive: false });
    button.addEventListener('touchend', handleTouchEnd, { passive: false });
    button.addEventListener('touchmove', handleTouchMove, { passive: false });
    button.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    // Add mouse fallbacks
    button.addEventListener('mousedown', handleMouseDown, { passive: false });
    button.addEventListener('dblclick', handleDoubleClick, { passive: false });

    // Cleanup
    return () => {
      if (button) {
        button.removeEventListener('touchstart', handleTouchStart, { passive: false });
        button.removeEventListener('touchend', handleTouchEnd, { passive: false });
        button.removeEventListener('touchmove', handleTouchMove, { passive: false });
        button.removeEventListener('touchcancel', handleTouchCancel, { passive: false });
        button.removeEventListener('mousedown', handleMouseDown, { passive: false });
        button.removeEventListener('dblclick', handleDoubleClick, { passive: false });
      }
    };
  }, [onSingleTap, onDoubleTap, isDisabled]); // Add isDisabled to dependencies

  return (
    <div
      ref={buttonRef}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer', // Change cursor when disabled
        // Apply default styles if needed, then merge with passed styles
        padding: '20px',
        borderRadius: '8px',
        margin: '10px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        opacity: isDisabled ? 0.5 : 1, // Optional: Visually indicate disabled state
        ...style
      }}
    >
      {children}
    </div>
  );
}