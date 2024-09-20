import styled from "styled-components";

const Wrapper = styled.div`
  background-color: var(--info-bg-color);
  padding: 2rem 3rem;
`;
const Text = styled.p`
  font-size: var(--font-size-sm);
`;

export default function BetterDesignSoon() {
  return (
    <Wrapper>
      <Text>
        Better design will come if this app becomes a successful project (if
        users actually uses it and find it somewhat useful)!
      </Text>
    </Wrapper>
  );
}
