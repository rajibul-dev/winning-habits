import styled, { css } from "styled-components";
import { pixelToEm } from "../styles/GlobalStyles";

const Heading = styled.h1`
  letter-spacing: -0.5pt;
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: var(--font-size-3xl);
      font-weight: 600;
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2.4rem;
      font-weight: 600;
    `}
    
    ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}
    
    ${(props) =>
    props.as === "h4" &&
    css`
      font-size: var(--font-size-3xl);
      font-weight: 600;
      text-align: center;
    `}
    
  line-height: 1.4;
`;

export default Heading;
