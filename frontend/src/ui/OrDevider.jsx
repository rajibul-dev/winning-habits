import styled from "styled-components";

const StyledOrDevider = styled.div`
  position: relative;
  padding: 2.6rem 0;
`;

const Border = styled.div`
  border-top: 1px dashed var(--color-grey-300);
  position: absolute;
  width: 100%;
  top: 50%;
`;

const Text = styled.span`
  display: inline-block;
  background-color: var(--color-grey-0);
  padding-inline: 1rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  color: var(--color-grey-400);
`;

export default function orDevider() {
  return (
    <StyledOrDevider>
      <Border />
      <Text>or</Text>
    </StyledOrDevider>
  );
}
