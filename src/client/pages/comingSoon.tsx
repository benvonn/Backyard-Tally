import React from "react";
import styled from "@emotion/styled";

const ComingSoonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  vwidth: 100vw;
  background-color: #000000ff;
  color: #0f0;
  font-family: VT323;
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 24px;
`;

export default function ComingSoon() {
  return (
    <ComingSoonContainer>
      <Title>Coming Soon!</Title>
      <Message>This feature is under development. Stay tuned!</Message>
    </ComingSoonContainer>
  );
}