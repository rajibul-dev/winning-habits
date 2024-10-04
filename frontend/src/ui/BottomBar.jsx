import styled from "styled-components";

const StyledBottomBar = styled.ul`
  grid-area: bottom-bar;

  height: 7rem;
  background-color: dodgerblue;
`;

export default function BottomBar() {
  return <StyledBottomBar></StyledBottomBar>;
}
