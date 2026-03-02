// modal.tsx (or wherever your Modal component is defined)
import styled from "@emotion/styled";
import { ReactNode, MouseEvent as ReactMouseEvent } from "react"; // Import ReactNode and ReactMouseEvent


interface ModalProps {  
  onClose: () => void;  
  children: ReactNode;  
}

// The component function signature should match the interface
export default function Modal({
  onClose,
  children,
}: ModalProps) { 

  return (
    <SModal onClick={onClose} role="dialog" aria-modal="true">
      
      <SContainer onClick={(e: ReactMouseEvent) => e.stopPropagation()}>
        {children}
        <SCloseButton 
          onClick={(e: ReactMouseEvent) => {
            e.stopPropagation(); // Prevent click from bubbling to the backdrop (SModal)
            onClose(); // Call the onClose function passed from LandingPage
          }}
          aria-label="Close modal"
          role="button"
          tabIndex={0}
        >X</SCloseButton>
      </SContainer>
      
    </SModal>
  );
}

// ... (your existing styles remain the same)
const SCloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 25px;
  height: 25px;
  cursor: pointer;
  z-index: 10;
  
  transition: transform 0.1s ease-in-out;
  background: #000000ff;
  color: #0f0;
  border: 2.5px solid #0f0;
  font-family: VT323;
  font-size: 15px;
  transition: all 0.2s ease;
  pointer-events: auto;
  
  &:hover {
    background: #0f0;
    color: #000;
    border-color: #000;
  }
  
  &:active {
    transform: scale(0.98);
  }
      &:focus {
    outline: 2px solid #1aff00;
    outline-offset: 2px;
  }
`;

const SModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.5);
`;

const SContainer = styled.div`
  position: relative;
  background-color: #000000ff; /* lilac color */
  min-width: 350px;
  font-family: VT323;
  padding: 1.9rem;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0px;
  border: 5px solid #0f0; /* Added green border similar to App.js */
`;