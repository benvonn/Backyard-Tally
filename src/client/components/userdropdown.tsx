import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

interface User {
  id: number | string;
  name: string;
}

interface UserDropdownProps {
  users: User[];
  currentUserName: string;
  currentUserId?: number | string | null;
  onUserSelect: (user: User) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const DropdownContainer = styled.div`
  position: absolute;
  background: rgb(0, 0, 0);
  border: 5px solid #0f0;
  padding: 8px;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledUserButton = styled.button<{ isCurrent: boolean }>`
  background: ${({ isCurrent }) => (isCurrent ? '#0f0' : '#000000ff')};
  border: 2.5px solid #0f0;
  color: ${({ isCurrent }) => (isCurrent ? '#000000ff' : '#0f0')};
  font-family: VT323;
  font-size: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.2s ease;
  margin-bottom: 4px;

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

/* Green toggle button — matches Game Data dropdown exactly */
const ToggleButton = styled.button`
  background: #0f0;
  border: solid 2.5px #0f0;
  color: #000000ff;
  cursor: pointer;
  padding: 0;
  font-family: VT323;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  width: 30vw;
`;

const ToggleText = styled.span`
  padding-left: 12px;
`;

const ToggleArrow = styled.span`
  padding-right: 12px;
`;

export default function UserDropdown({ 
  users, 
  currentUserName, 
  currentUserId,
  onUserSelect, 
  onLogout,
  isOpen,
  onToggle
}: UserDropdownProps) {

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#user-dropdown") && !target.closest("#user-dropdown-toggle")) {
        if (isOpen) onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
      <ToggleButton id="user-dropdown-toggle" onClick={onToggle}>
        <ToggleText>Welcome, {currentUserName}</ToggleText>
        <ToggleArrow>▼</ToggleArrow>
      </ToggleButton>
      
      {isOpen && (
        <DropdownContainer id="user-dropdown">
          {users.map((user) => (
            <StyledUserButton
              key={user.id}
              isCurrent={user.id === currentUserId}
              onClick={() => {
                onUserSelect(user);
                onToggle();
              }}
            >
              {user.name}
            </StyledUserButton>
          ))}
        </DropdownContainer>
      )}
    </div>
  );
}