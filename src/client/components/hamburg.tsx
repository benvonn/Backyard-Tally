import React from "react";
import { useNavigate } from "react-router";
import Modal from "./modal.tsx";
import styled from "@emotion/styled";

const StyledButton = styled.button`
  background: #000000ff;
  border: 2.5px solid #0f0;
  color: #0f0;
  font-family: VT323;
  font-size: 25px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: all 0.2s ease;

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
const HamburgerStyled = styled.button`
  background: #000000ff;
  border: 2.5px solid #0f0;
  color: #0f0;
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
  }`

export default function Hamburg() {
  const [isOpened, setIsOpened] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '10px' }}>
      <HamburgerStyled onClick={() => setIsOpened(!isOpened)}>☰</HamburgerStyled>
      {isOpened && (
        <Modal onClose={() => setIsOpened(false)}>
          <StyledButton onClick={() => navigate("/home")}>Home</StyledButton>
          <StyledButton onClick={() => navigate("/user/profile")}>Profile</StyledButton>
          <StyledButton onClick={() => navigate("/comingSoon")}>History</StyledButton>
          <StyledButton onClick={() => navigate("/")}>Landing</StyledButton>
        </Modal>
      )}
    </div>
  );
}