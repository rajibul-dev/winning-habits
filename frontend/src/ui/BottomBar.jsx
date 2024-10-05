import styled from "styled-components";
import { bottomBarIndex } from "../styles/zIndexManager";

const StyledBottomBar = styled.ul`
  z-index: ${bottomBarIndex};
  grid-area: bottom-bar;

  height: 7rem;
  background-color: dodgerblue;
`;

export default function BottomBar() {
  return <StyledBottomBar></StyledBottomBar>;
}
