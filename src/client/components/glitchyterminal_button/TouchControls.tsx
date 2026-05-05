import React, { useRef, useEffect, useState } from 'react';

interface TouchButtonProps {
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  bagIn?: boolean;
  bagOn?: boolean;
}

export default function TouchButton({ 
  onSingleTap, 
  onDoubleTap,
  children,
  style = {},
  bagIn,
  bagOn
}: TouchButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    let touchCount: number = 0;
    let touchStart: number | null = null;

    const DEBOUNCE_DELAY = 300;

    const handleTouchStart = (e: TouchEvent) => {
      if (isDisabled) { e.preventDefault(); return; }
      touchCount = e.touches.length;
      touchStart = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDisabled) { e.preventDefault(); return; }

      const touchDuration = Date.now() - (touchStart ?? 0);

      if (touchDuration < 500 && touchStart !== null) {
        const handler = touchCount === 1 ? onSingleTap : touchCount === 2 ? onDoubleTap : null;

        if (handler) {
          setIsDisabled(true);
          handler();
          setTimeout(() => setIsDisabled(false), DEBOUNCE_DELAY);
        }
      }

      touchCount = 0;
      touchStart = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDisabled) { e.preventDefault(); return; }
      touchCount = e.touches.length;
    };

    const handleTouchCancel = (e: TouchEvent) => {
      if (isDisabled) { e.preventDefault(); return; }
      touchCount = 0;
      touchStart = null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isDisabled) { e.preventDefault(); return; }
      setIsDisabled(true);
      onSingleTap?.();
      setTimeout(() => setIsDisabled(false), DEBOUNCE_DELAY);
    };

    const handleDoubleClick = (e: MouseEvent) => {
      if (isDisabled) { e.preventDefault(); return; }
      setIsDisabled(true);
      onDoubleTap?.();
      setTimeout(() => setIsDisabled(false), DEBOUNCE_DELAY);
    };

    button.addEventListener('touchstart', handleTouchStart, { passive: false });
    button.addEventListener('touchend', handleTouchEnd, { passive: false });
    button.addEventListener('touchmove', handleTouchMove, { passive: false });
    button.addEventListener('touchcancel', handleTouchCancel, { passive: false });
    button.addEventListener('mousedown', handleMouseDown, { passive: false });
    button.addEventListener('dblclick', handleDoubleClick, { passive: false });

    return () => {
      button.removeEventListener('touchstart', handleTouchStart);
      button.removeEventListener('touchend', handleTouchEnd);
      button.removeEventListener('touchmove', handleTouchMove);
      button.removeEventListener('touchcancel', handleTouchCancel);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [onSingleTap, onDoubleTap, isDisabled]);

  return (
    <div
      ref={buttonRef}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        padding: '20px',
        borderRadius: '8px',
        margin: '10px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        opacity: isDisabled ? 0.5 : 1,
        ...style
      }}
    >
      {children}
    </div>
  );
}