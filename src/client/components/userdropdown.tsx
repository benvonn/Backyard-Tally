import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

interface User {
  id: number;
  name: string;
  board?: string;
}

interface UserDropdownProps {
  users: User[];
  currentUserName: string;
  currentUserId?: number | null;
  onUserSelect: (user: User) => void;
  onLogout: () => void;
}
const DropdownContainer = styled.div`
  position: absolute;
  background: #000000ff;
  border: 5px solid #0f0;
  padding: 8px;
  margin-top: 4px; /* This pushes it down from the toggle button */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
  
  /* Position it below the toggle button */
  top: 100%; /* Position at bottom of parent */
  left: 50%;
  transform: translateX(-50%);
`;

const SwitchUserText = styled.div`
  font-size: 12px;
  color: #666;
  padding: 4px 16px;
  margin-bottom: 4px;
  font-family: VT323;
`;

const StyledUserButton = styled.button<{ isCurrent: boolean }>`
  background: ${({ isCurrent }) => (isCurrent ? '#0f0' : '#000000ff')};
  border: 2.5px solid #0f0;
  color: ${({ isCurrent }) => (isCurrent ? '#000000ff' : '#0f0')};
  font-family: VT323;
  font-size: 20px; // Slightly smaller than 25px for dropdown
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


const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: #0f0;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-family: VT323;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Hr = styled.hr`
  margin: 8px 0;
  border: none;
  border-top: 1px solid #0f0;
`;

export default function UserDropdown({ 
  users, 
  currentUserName, 
  currentUserId,
  onUserSelect, 
  onLogout 
}: UserDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#user-dropdown") && !target.closest("#user-dropdown-toggle")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%' 
    }}>
      <ToggleButton 
        id="user-dropdown-toggle"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Welcome, {currentUserName} ▼
      </ToggleButton>
      
      {showDropdown && (
        <DropdownContainer id="user-dropdown">
          
          {users.map((user) => (
            <StyledUserButton
              key={user.id}
              isCurrent={user.id === currentUserId}
              onClick={() => {
                onUserSelect(user);
                setShowDropdown(false);
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