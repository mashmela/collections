import React from "react";
import styled from "styled-components";
import Image from "next/image";

interface PenInterFace {
  disabled?: boolean;
  width: number;
  height: number;
  onClick: () => void;
  src: string;
}

function Tool({ onClick, width, height, src }: PenInterFace) {
  return <StyleTool onClick={onClick} src={src} alt="" width={width} height={height} />;
}

const StyleTool = styled(Image)`
  cursor: pointer;

  :hover {
    transition: all 0.1s ease-in-out;
    filter: brightness(0.7);
  }
`;

export default React.memo(Tool);
