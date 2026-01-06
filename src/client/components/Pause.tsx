import React from 'react';
import PauseButton from './Icons/PauseButton.tsx';
import Modal from './modal.tsx';

interface PauseProps {
    onRestart: () => void;
}

export default function Pause({ onRestart } : PauseProps) {
    const [isPaused, setIsPaused] = React.useState(false);

    const handleRestart = () => {
        if (window.confirm("Are you sure you want to restart the game? All progress will be lost.")) {
            onRestart();
            setIsPaused(false); // Close modal after restart
        }
    };

    return (
        <div onClick={() => setIsPaused(true)} style={{ cursor: 'pointer', width: '50px', height: '50px' }}>
            <PauseButton  />

            {isPaused && 
            <Modal onClose={() => setIsPaused(false)}>
                <h2>Paused</h2>
                <button onClick={() => setIsPaused(false)}>Resume</button>
                <button onClick={handleRestart} style={{ marginTop: '1rem' }}>
                    Restart
                </button>
                <button>ENDNeedstobeadded</button>
            </Modal>
            }
        </div>
    );
}