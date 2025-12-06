import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal from "../components/modal.tsx";
import { useNavigate } from "react-router-dom";
import UserSetup from "../setup/UserSetup.js";

export default function LandingPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Get Started!</button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
           <UserSetup />
        </Modal>
      )}
    </>
  );
}
