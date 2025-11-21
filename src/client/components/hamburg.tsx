import React from "react";
import { useNavigate } from "react-router";
import Modal from "./modal.tsx";
export default function Hamburg() {
    const [isOpened, setIsOpened] = React.useState(false);
    const navigate = useNavigate();
    return(
        <div>
            <button onClick={() => {setIsOpened(!isOpened)}}>☰</button>
        {isOpened &&
        <Modal onClose={() => {setIsOpened(false)}}>
            <button onClick={()=> {navigate("/home")}}>Home</button>
            <button onClick={() => {navigate("user/profile")}}>Profile</button>
            <button onClick={() => {navigate("/history")}}>History</button>
            <button onClick={() => {navigate("")}}>Settings</button>
        </Modal>
        }
        </div>
    )
}