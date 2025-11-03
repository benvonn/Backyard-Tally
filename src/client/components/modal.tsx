import styled from "@emotion/styled";
import {ReactComponent as CloseIcon} from "../components/Icons/closeCircle.svg";

const SCloseButton = styled(CloseIcon)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 25px;
  height: 25px;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.1s ease-in-out;
  color: white; 
  pointer-events: auto;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(1);
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
  background-color: #9b87c4; /* lilac color */
  min-width: 300px;
  padding: 2rem;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 30px;
`;

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <SModal onClick={onClose} role="dialog" aria-modal="true">
      <SContainer onClick={(e) => e.stopPropagation()}>
        {children}
        <SCloseButton 
          onClick={(e: { stopPropagation: () => void; }) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close modal"
          role="button"
          tabIndex={0}
        />
      </SContainer>
    </SModal>
  );
}