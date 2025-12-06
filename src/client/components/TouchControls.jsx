import React, { useRef, useEffect } from 'react';

export default function TouchButton({ 
  onSingleTap, 
  onDoubleTap,
  children,
  style = {}
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    let touchCount = 0;
    let touchStart = null;

    const handleTouchStart = (e) => {
      touchCount = e.touches.length;
      touchStart = Date.now();
    };

    const handleTouchEnd = (e) => {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStart;
      
      if (touchDuration < 500 && touchStart !== null) {
        if (touchCount === 1) {
          onSingleTap?.();
        } else if (touchCount === 2) {
          onDoubleTap?.();
        }
      }
      
      touchCount = 0;
      touchStart = null;
    };

    const handleTouchMove = (e) => {
      touchCount = e.touches.length;
    };

    const handleTouchCancel = (e) => {
      touchCount = 0;
      touchStart = null;
    };

    button.addEventListener('touchstart', handleTouchStart, { passive: false });
    button.addEventListener('touchend', handleTouchEnd, { passive: false });
    button.addEventListener('touchmove', handleTouchMove, { passive: false });
    button.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      button.removeEventListener('touchstart', handleTouchStart, { passive: false });
      button.removeEventListener('touchend', handleTouchEnd, { passive: false });
      button.removeEventListener('touchmove', handleTouchMove, { passive: false });
      button.removeEventListener('touchcancel', handleTouchCancel, { passive: false });
    };
  }, [onSingleTap, onDoubleTap]);

  return (
    <div
      ref={buttonRef}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: 'pointer',
        padding: '20px',
        background: '#4CAF50',
        color: 'white',
        borderRadius: '8px',
        margin: '10px',
        ...style
      }}
    >
      {children}
    </div>
  );
}