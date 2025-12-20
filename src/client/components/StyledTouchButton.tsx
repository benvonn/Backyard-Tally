// StyledTouchButton.tsx
import React, { ReactNode, useRef, useEffect, useCallback, useMemo } from 'react';
import TouchButton from './TouchControls'; // Import the original TouchControls
import FaultyTerminal from './TouchBackground.tsx'; // Adjust path to FaultyTerminal

interface StyledTouchButtonProps {
  children: ReactNode; // This will be the large number to display
  onPlusTap?: () => void; // Handler for the upper region (for +1 / +3)
  onMinusTap?: () => void; // Handler for the lower region (for -1 / -3)
  bagIn: any;
  bagOn: any;
  isMinusButton?: boolean;
  terminalProps?: Parameters<typeof FaultyTerminal>[0];
  containerStyle?: React.CSSProperties;
}

const StyledTouchButtonComponent: React.FC<StyledTouchButtonProps> = ({
  children,
  onPlusTap,
  onMinusTap,
  bagIn,
  bagOn,
  isMinusButton = false,
  terminalProps = {},
  containerStyle = {},
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const pointerStartYRef = useRef<number | null>(null); // Ref to store pointer start Y coordinate

  // Memoize terminal props to prevent unnecessary re-renders of FaultyTerminal
  const memoizedTerminalProps = useMemo(() => {
    const baseTerminalProps = {
      scale: 1.5,
      gridMul: [2, 1] as [number, number],
      digitSize: 1.2,
      timeScale: 1,
      pause: false,
      scanlineIntensity: 1,
      glitchAmount: 1,
      flickerAmount: 1,
      noiseAmp: 1,
      chromaticAberration: 0,
      dither: 0,
      curvature: 0,
      // Use a different tint based on the button type, allow override via terminalProps
      tint: isMinusButton ? '#ff0000' : '#00ff00', 
      mouseReact: true,
      mouseStrength: 0.5,
      pageLoadAnimation: false,
      brightness: 1,
    };

    return { ...baseTerminalProps, ...terminalProps };
  }, [isMinusButton, terminalProps]); // Only recalculate if isMinusButton or terminalProps changes

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartYRef.current = e.clientY;
    e.preventDefault(); // Prevent potential text selection or drag
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const pointerStartY = pointerStartYRef.current;
    if (pointerStartY !== null) {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const clientY = e.clientY; // Use e.clientY from PointerEvent

      if (clientY < centerY) {
        // Tap in the upper half (for +1 / +3)
        onPlusTap?.();
      } else {
        // Tap in the lower half (for -1 / -3)
        onMinusTap?.();
      }
    }

    pointerStartYRef.current = null;
  }, [onPlusTap, onMinusTap]); // onPlusTap and onMinusTap might change, so include them

  // Memoize the number display element separately
  const NumberDisplay = useMemo(() => (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        fontSize: '300px',
        fontWeight: 'bold',
        fontFamily: 'DigitTech16', // No 'src' property here
        color: 'white',
      }}

    >
      {children} {/* The changing number */}
    </div>
  ), [children]); // Only re-create if children change

  return (
    <div
      ref={buttonRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%', // Fill the available height
        margin: '8px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...containerStyle,
        touchAction: 'none', // Important for pointer events
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* FaultyTerminal as background - now uses memoized props */}
      <FaultyTerminal
        {...memoizedTerminalProps} // Use the memoized props
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius: '15px',
          width: '100%',
          height: '100%',
          zIndex: 1,
          ...(terminalProps.style || {}),
        }}
      />
      
      {/* Inner TouchButton (handles touch logic and provides clickable area) */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <TouchButton
          // Pass empty functions or use the event listeners directly if needed
          onSingleTap={() => {}} // Placeholder - handled by pointer events above
          onDoubleTap={() => {}} // Placeholder - handled by pointer events above
          bagIn={bagIn}
          bagOn={bagOn}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            border: 'none',
            background: 'transparent', // Make the TouchButton div itself transparent
            color: 'transparent',     // Make any default text transparent
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {/* Use the memoized number display */}
          {NumberDisplay}
        </TouchButton>
      </div>
    </div>
  );
};

const StyledTouchButton = React.memo(StyledTouchButtonComponent);

export default StyledTouchButton;