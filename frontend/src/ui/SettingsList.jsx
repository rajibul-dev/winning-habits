import styled, { css } from "styled-components";

const StyledBox = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  border: var(--usual-layout-border);
`;

const OptionItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 1.8rem 2.5rem;
  font-weight: 500;
  cursor: pointer;

  ${({ $nonButton }) =>
    !$nonButton &&
    css`
      &:hover {
        background-color: var(--color-grey-200);
      }
    `}

  ${({ $type }) => {
    switch ($type) {
      case "danger":
        return css`
          color: var(--color-red-700);
        `;

      default:
        break;
    }
  }}
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-200);
  }
`;

function SettingsList({ children }) {
  return <StyledBox>{children}</StyledBox>;
}

function Option({ children, nonButton = false, type }) {
  return (
    <OptionItem $type={type} $nonButton={nonButton}>
      {children}
    </OptionItem>
  );
}

SettingsList.Option = Option;

export default SettingsList;
