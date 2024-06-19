import styled, { css } from "styled-components";

const types = {
  success: css`
    background-color: var(--color-green-100);
    color: var(--color-green-700);
  `,
  error: css`
    background-color: var(--color-red-100);
    color: var(--color-red-700);
  `,
};

const PageLevelNotificationToast = styled.div`
  padding: 1.6rem;
  font-size: var(--font-size-base);
  ${(props) => types[props.type]}
`;

PageLevelNotificationToast.defaultProps = {
  type: "success",
};

export default PageLevelNotificationToast;
