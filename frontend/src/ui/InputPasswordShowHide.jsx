import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  font-size: var(--font-size-base);
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  padding-right: 6rem;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);

  background: none;
  border: none;
  color: var(--color-grey-500);

  &:focus {
    outline: none;
  }
`;

export default function InputPasswordShowHide({ id, ...rest }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Wrapper>
      <Input id={id} type={!showPassword ? "password" : "name"} {...rest} />
      <ToggleButton
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowPassword((curr) => !curr);
        }}
      >
        {!showPassword ? "Show" : "Hide"}
      </ToggleButton>
    </Wrapper>
  );
}
