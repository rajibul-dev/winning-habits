import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);

      @media (max-width: 27em) {
        padding: 2.4rem 2rem;
      }
    `}

  ${(props) => props.type === "modal" && css``}
    
  overflow: hidden;
  font-size: var(--font-size-sm);
`;

Form.defaultProps = {
  type: "regular",
};

export default Form;
