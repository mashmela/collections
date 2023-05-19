import React from "react";
import Image from "next/image";
import styled from "styled-components";

interface SelectInterface {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function Select({ value, placeholder, options, onChange, disabled }: SelectInterface) {
  const [showVariants, setShowVariants] = React.useState(false);

  const handleOpenClick = React.useCallback(() => {
    if (disabled) return;
    setShowVariants((value) => !value);
  }, [disabled]);

  const handleChooseClick = React.useCallback(
    (rank: string) => {
      setShowVariants((value) => !value);
      onChange(rank);
    },
    [onChange],
  );

  return (
    <>
      <Selected rotateButton={showVariants} onClick={handleOpenClick}>
        {value || placeholder}
        {!disabled && <Image src="/icon/Open.png" width={17} height={10} alt="" />}
      </Selected>
      <div>
        {showVariants && (
          <Variants>
            {options.map((rank, index) => (
              <Value key={index} onClick={() => handleChooseClick(rank)}>
                {rank}
              </Value>
            ))}
          </Variants>
        )}
      </div>
    </>
  );
}

const Selected = styled("div")<{ rotateButton: boolean }>`
  font-size: 16px;
  outline: none;
  border-radius: 8px;
  height: 32px;
  border: solid 1px #aaa;
  width: 400px;
  padding: 0px 12px;
  box-sizing: border-box;
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  img {
    filter: brightness(0.7);
    transform: rotate(${({ rotateButton }) => (rotateButton ? "180deg" : "0deg")});
    transition: all 0.4s ease-in-out;
  }
`;

const Variants = styled("div")`
  position: fixed;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: solid 1px #aaa;
  background-color: white;
  }
`;

const Value = styled("div")`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  height: 32px;
  width: 400px;
  cursor: pointer;

  &:hover {
    background-color: #d9d9d9;
    border-radius: 8px;
  }
`;

export default React.memo(Select);
