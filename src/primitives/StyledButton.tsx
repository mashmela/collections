import React from "react";
import styled from "styled-components";

interface ButtonInterFace {
  disabled?: boolean;
  onClick: () => void;
  children: string;
}

function StyledButton({ disabled, onClick, children }: ButtonInterFace) {
  return (
    <Button disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}

const Button = styled("button")`
  background: black;
  color: white;
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  transition: 1ms ease-in-out;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  :hover {
    transition: all 0.1s ease-in-out;
    background: #424242;
  }
  :disabled {
    background: #d9d9d9;
    cursor: auto;
  }
`;

export default React.memo(StyledButton);
