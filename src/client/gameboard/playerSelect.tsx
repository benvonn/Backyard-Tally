// components/game/PlayerSelect.tsx
import { useState } from 'react';
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

export default function PlayerSelect({ users, selectedPlayer1, selectedPlayer2, onSelectP1, onSelectP2, onStart }: Props) {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const p1Name = users.find(u => u.id === selectedPlayer1)?.name ?? 'Select Player 1';
  const p2Name = users.find(u => u.id === selectedPlayer2)?.name ?? 'Select Player 2';

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'VT323' }}>
      <h2>Select Players</h2>

      {users.length === 0 && (
        <p style={{ color: 'orange', marginBottom: '20px' }}>Please select Users</p>
      )}

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

      <button onClick={onStart} disabled={users.length === 0}>Start Game</button>
    </div>
  );
}