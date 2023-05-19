import React from "react";

import styled, { StyledComponentProps } from "styled-components";

interface InputInterface
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  value?: string;
}

function Input({
  ...inputProps
}: StyledComponentProps<"input", InputInterface, InputInterface, never>) {
  return <InputStyled {...inputProps} />;
}

const InputStyled = styled("input")`
  font-size: 16px;
  outline: none;
  border-radius: 8px;
  height: 32px;
  border: solid 1px #aaa;
  width: 400px;
  padding: 12px;
  box-sizing: border-box;

  &:disabled {
    color: black;
    background-color: white;
  }
`;

export default React.memo(Input);
