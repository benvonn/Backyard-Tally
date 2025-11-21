import React, { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  board?: string;
}

interface UserDropdownProps {
  users: User[];
  currentUserName: string;
  onUserSelect: (user: User) => void;
  onLogout: () => void;
}

export default function UserDropdown({ 
  users, 
  currentUserName, 
  onUserSelect, 
  onLogout 
}: UserDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#user-dropdown") && !target.closest("#user-dropdown-toggle")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        id="user-dropdown-toggle"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Welcome, {currentUserName} ▼
      </button>
      
      {showDropdown && (
        <div 
          id="user-dropdown"
          style={{ 
            position: 'absolute', 
            background: 'white', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
            marginTop: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            minWidth: '200px'
          }}
        >
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            padding: '4px 16px',
            marginBottom: '4px'
          }}>
            Switch User
          </div>
          
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                onUserSelect(user);
                setShowDropdown(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 16px',
                border: 'none',
                background: user.name === currentUserName ? '#f0f0f0' : 'none',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = user.name === currentUserName ? '#f0f0f0' : 'transparent';
              }}
            >
              {user.name}
            </button>
          ))}
          
          <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
          
          <button
            onClick={() => {
              onLogout();
              setShowDropdown(false);
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 16px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: 'red',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}