import React from 'react';


export default function RoundButton({ player1, player2, onEndRound }) {
    const handleEndRound = () => {
        // Save round scores before calculating winner
        player1.endRound();
        player2.endRound();
        
        const difference = Math.abs(player1.roundPoints - player2.roundPoints);
        
        if (player1.roundPoints > player2.roundPoints) {
            player1.totalPoints += difference;
        } else if (player2.roundPoints > player1.roundPoints) {
            player2.totalPoints += difference;
        }
        
        // Notify parent to re-render
        if (onEndRound) {
            onEndRound();
            console.log("Bag", player1.bags);
            console.log("Bag", player2.bags);
            player1.newRound();
            player2.newRound();
        }
    };

    return (
        <button onClick={handleEndRound}>End Round</button>
    );
}