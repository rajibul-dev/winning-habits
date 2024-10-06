import styled from "styled-components";

const Wrapper = styled.div`
  background-color: var(--info-bg-color);
  padding: 2rem 3rem;
`;
const Text = styled.p`
  font-size: var(--font-size-sm);
`;

export default function Info({ children }) {
  return (
    <Wrapper>
      <Text>{children}</Text>
    </Wrapper>
  );
}
