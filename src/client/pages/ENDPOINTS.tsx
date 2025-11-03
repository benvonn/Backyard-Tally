import {Routes, Route} from "react-router-dom";
import LandingPage from "../gameboard/LandingPage";
import UserProfile from "../user-profile/UserProfile.tsx";

export default function Endpoints(){
    return(
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/user/profile" element={<UserProfile/>}/>
    </Routes>
    )
};