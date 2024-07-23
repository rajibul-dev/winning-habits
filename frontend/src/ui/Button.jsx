import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: var(--font-size-xsm);
    padding: 0.6rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
    box-shadow: none;
  `,
  medium: css`
    font-size: var(--font-size-sm);

    ${(props) =>
      props.$variation === "primary" &&
      css`
        /* offset-x | offset-y | blur-radius | color */
        text-shadow: 0 1.5px 0 var(--color-brand-800);
        letter-spacing: 0.03pt;
      `}

    padding-inline: 1.6rem;
    padding-top: 1.3rem;
    padding-bottom: ${({ $variation }) =>
      $variation === "primary" ? css`1.7rem` : css`1.3rem`};
    font-weight: 700;
  `,
  large: css`
    font-size: var(--font-size-lg);

    ${(props) =>
      props.$variation === "primary" &&
      css`
        /* offset-x | offset-y | blur-radius | color */
        text-shadow: 0 1.5px 0 var(--color-brand-800);
        letter-spacing: 0.03pt;
      `}

    padding-inline: 2.4rem;
    padding-top: 1.5rem;
    padding-bottom: ${({ $variation }) =>
      $variation === "primary" ? css`1.9rem` : css`1.5rem`};
    font-weight: 700;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
    box-shadow: inset 0 -6px 0 var(--color-brand-800);

    ${(props) =>
      props.size !== "small"
        ? css`
            &:hover {
              background-color: var(--color-brand-500-modified-1);
              box-shadow:
                inset 0 -6px 0 var(--color-brand-800),
                0 0 10px var(--color-brand-500-modified-1-shadow);
            }
          `
        : css`
            &:hover {
              background-color: var(--color-brand-500-modified-1);
            }
          `}
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: var(--usual-layout-border);
    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700-mod);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
  constGrey: css`
    color: #666463;
    background-color: #dbd9d7;
    box-shadow: inset 0 -6px 0 #aaa6a1;

    &:hover {
      color: #504f4f;
      background-color: #e7e6e4;
    }
  `,
  constRed: css`
    color: #eee;
    /* background-color: #ef4444; */
    background-color: #e54747;
    box-shadow: inset 0 -6px 0 #af4343;

    &:hover {
      color: #fff;
      background-color: #f13e3e;
    }
  `,
};

const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  ${(props) => variations[props.$variation]}
  ${(props) => sizes[props.size]}
`;

Button.defaultProps = {
  $variation: "primary",
  size: "medium",
};

export default Button;
