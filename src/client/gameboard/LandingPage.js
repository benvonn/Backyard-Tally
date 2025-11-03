import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal from "../components/modal.tsx";
import { useNavigate } from "react-router-dom";

const Timeline = styled.div`
  position: relative;
  padding-left: 25px;
  margin: 20px auto;
  width: fit-content;
`;

const Line = styled.div`
  position: absolute;
  left: 28px;
  top: 20%;
  bottom: 20%;
  width: 2px;
  background: #444;
`;

const Step = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 28px 0;
  font-size: 0.95rem;
  color: #ccc;
`;

const Dot = styled.div`
  position: absolute;
  left: -3px;
  width: 10px;
  height: 10px;
  background: white;
  border: 2px solid orangered;
  border-radius: 20%;
`;

const Title = styled.span`
  margin-left: 15px;
  color: orangered;
  background: transparent;
  border: none;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-align: left;
  transition: color 0.2s;

  &:hover {
    color: #ff7043;
  }

  &:focus {
    outline: none;
  }
`;

export default function LandingPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Get Started!</button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <Timeline>
            <Line />
            <Step>
              <Dot />
              <Title onClick={() => {navigate("/user/setup/profile")}}>Setup Profile! Here!</Title>
            </Step>
            <Step>
              <Dot />
              <Title>Choose a Board</Title>
            </Step>
            <Step>
              <Dot />
              <Title>Confirm</Title>
            </Step>
          </Timeline>
        </Modal>
      )}
    </>
  );
}
