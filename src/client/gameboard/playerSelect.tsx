import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import UserDropdown from '../components/userdropdown';

interface User {
  id: number;
  name: string;
}

interface Props {
  users: User[];
  selectedPlayer1: number | null;
  selectedPlayer2: number | null;
  onSelectP1: (id: number) => void;
  onSelectP2: (id: number) => void;
  onStart: () => void;
}

const StyledButton = styled.button`
  background: #000000ff;
  border: 2.5px solid #0f0;
  color: #0f0;
  font-family: VT323;
  font-size: 25px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin: 10px;
  width: 70%;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Title = styled.h2`
  color: #0f0;
  font-family: VT323;
  font-size: 30px;
`;

const Warning = styled.p`
  color: #f00;
  margin-bottom: 20px;
`;

export default function PlayerSelect({ users: propUsers, selectedPlayer1, selectedPlayer2, onSelectP1, onSelectP2, onStart }: Props) {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [localUsers, setLocalUsers] = useState<User[]>(() => {
    try {
      const cached = localStorage.getItem("allUsers");
      const parsed = cached ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });


  const merged = [...localUsers, ...propUsers];
const seen = new Set<number>();
const users = merged.filter(u => {
  if (seen.has(u.id)) return false;
  seen.add(u.id);
  return true;
});

  const p1Name = users.find(u => u.id === selectedPlayer1)?.name ?? 'Select Player 1';
  const p2Name = users.find(u => u.id === selectedPlayer2)?.name ?? 'Select Player 2';

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'VT323' }}>
      <Title>Select Players</Title>

      {users.length === 0 && <Warning>Please select Users</Warning>}

      <UserDropdown
        users={users}
        currentUserName={p1Name}
        currentUserId={selectedPlayer1}
        onUserSelect={(user) => onSelectP1(user.id as number)}
        onLogout={() => {}}
        isOpen={isOpen1}
        onToggle={() => setIsOpen1(prev => !prev)}
      />

      <UserDropdown
        users={users}
        currentUserName={p2Name}
        currentUserId={selectedPlayer2}
        onUserSelect={(user) => onSelectP2(user.id as number)}
        onLogout={() => {}}
        isOpen={isOpen2}
        onToggle={() => setIsOpen2(prev => !prev)}
      />

      <StyledButton onClick={onStart} disabled={users.length === 0}>
        Start Game
      </StyledButton>
    </div>
  );
}