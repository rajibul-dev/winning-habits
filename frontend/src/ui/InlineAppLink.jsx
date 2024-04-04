import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

const InlineLink = styled(Link)`
  font: inherit;
  color: var(--color-indigo-700);

  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  ${(props) =>
    props.$usage === "pale-color" &&
    css`
      color: var(--color-grey-400);
    `}

  ${(props) =>
    props.$usage === "forgot-password" &&
    css`
      display: block;
      text-align: center;
      margin-top: 0.3rem;
      color: var(--color-grey-400);
    `}

  ${(props) =>
    props.as === "button" &&
    css`
      background: none;
      border: none;
    `}

  &:disabled, &:disabled:hover {
    color: var(--color-grey-400);
    text-decoration: none;
  }
`;

export default InlineLink;
