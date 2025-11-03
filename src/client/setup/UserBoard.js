import React,{ useState, useEffect} from "react";
import Modal from "../components/modal.tsx";
import Casual_Main_Area from "../gameboard/casual_setup/casual_main_area";
import Pro_Main_Area from "../gameboard/pro_setup/pro_main_area";

export default function BoardSetup() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [selectedBoard, setSelectedBoard] = useState(null);
    return (
        <>
        {isModalOpen &&(
          <Modal onClose={() => setIsModalOpen(false)}>
            <h1>Choose a Board</h1>
            <p>Select a board to view its details or make changes.</p>
            <button style={{ zIndex: 10 }} onClick={() => { setIsModalOpen(false); setSelectedBoard("casual"); }}>Casual</button>
            <button style={{ zIndex: 10 }} onClick={() => { setIsModalOpen(false); setSelectedBoard("pro"); }}>Pro</button>
            </Modal>
        )}
        
        {selectedBoard === "casual" && 
        <>
        <button onClick={() => setIsModalOpen(true)}>Back</button>
        <Casual_Main_Area />
        <button onClick={() => alert("Board setup confirmed!")}>Confirm Setup</button>
        </>}
        {selectedBoard === "pro" && 
        <>
        <button onClick={() => setIsModalOpen(true)}>Back</button>
        <Pro_Main_Area />
        <button onClick={() => alert("Board setup confirmed!")}>Confirm Setup</button>
        </>
        }
        </>
    );
}