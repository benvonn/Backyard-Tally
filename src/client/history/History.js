// WIll hold past games, also display stats for each game, potentially have draggable widgets like ALTX dashboard
import React, {useState, useEffect} from "react";
import DraggableWidgetBoard from "../components/Widgets.tsx";
import Modal from "../components/modal.tsx";
import GameHistory from "../components/history-components/GameHistory";


export default function History() {
    const [ismodalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="history-page">
            <h1>History Page</h1>
            <DraggableWidgetBoard>
                <GameHistory />
            </DraggableWidgetBoard>
        </div>
    );
}