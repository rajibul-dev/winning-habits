import styled from "styled-components";

const Paragraph = styled.p`
  font-size: var(--font-size-base);
`;

function Empty({ resourceName }) {
  return <Paragraph>No {resourceName} could be found.</Paragraph>;
}

export default Empty;
