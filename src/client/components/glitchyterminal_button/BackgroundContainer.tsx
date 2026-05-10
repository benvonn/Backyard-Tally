// GlitchyContainer.tsx
import React, { PropsWithChildren } from 'react';
import FaultyTerminal from './TouchBackground'; // Adjust path

interface GlitchyContainerProps extends PropsWithChildren {
  // You can pass props to FaultyTerminal if needed
  terminalScale?: number;
  terminalTint?: string;
  // ... other FaultyTerminal props you want to expose
  containerStyle?: React.CSSProperties; // Optional: style the outer container
}

const GlitchyContainer: React.FC<GlitchyContainerProps> = ({
  children,
  terminalScale = 1.5,
  terminalTint = '#126f12ff', // Example default
  containerStyle = {borderRadius: '15px'},
}) => {
  return (
    <div 
      style={{ 
        position: 'relative', // Container for absolute positioning
        width: '100%', 
        height: '100%', // Or specific height
        overflow: 'hidden', // Contain the canvas
        ...containerStyle
      }}
    >
      {/* Render the FaultyTerminal as the background */}
      <FaultyTerminal
        scale={terminalScale}
        tint={terminalTint}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        // Pass other props as needed
      />
      
      {/* Render the children on top of the FaultyTerminal */}
      <div 
        style={{ 
          position: 'relative', 
          zIndex: 2, // Ensure children are above the terminal
          // Add padding or other styles as needed to accommodate the content
          padding: '20px',  // Example: ensure text is readable over the effect
          pointerEvents: 'auto', // Ensure children receive pointer events
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GlitchyContainer;