// History.tsx
import React, { useState } from "react";
import DraggableWidgetBoard from "../components/Widgets.tsx";
import GameHistory from "../utils/GameHistory.js";
import PlayerPRStats from "../utils/PlayerPRStats.tsx";

export default function History() {
    return (
        <div className="history-page">
            <h1>History Page</h1>
            <DraggableWidgetBoard 
                availableWidgets={[
                    { id: 'gameHistory', component: GameHistory, name: 'Game History' },
                    { id: 'playerStats', component: PlayerPRStats, name: 'Player Stats' }
                ]}
            />
        </div>
    );
}