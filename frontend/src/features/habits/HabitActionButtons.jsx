import styled, { css } from "styled-components";
import Row from "../../ui/Row.jsx";
import Button from "../../ui/Button.jsx";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import useUpdateAction from "./useUpdateAction.js";
import useAddAction from "./useAddAction.js";
import { capitalizeString } from "../../utils/capitalizeString.js";
import { createContext, useContext } from "react";

const VariantContext = createContext();

const withVariant = (Component) => (props) => {
  const variant = useContext(VariantContext);
  return <Component {...props} $variant={variant} />;
};

const Wrapper = styled(Row)`
  ${({ $variant }) =>
    $variant === "design-2" &&
    css`
      border: 1px solid var(--color-grey-400);
      height: 11rem;
      width: 25rem;
      padding: 1rem 3rem;
      margin: 0 auto;
      justify-content: center;
      gap: 1rem;
    `}

  ${({ $variant, $didIt }) => {
    if ($variant === "design-2" && $didIt !== "unanswered") {
      if ($didIt === "yes") {
        return css`
          background-color: var(--color-green-100);
        `;
      } else {
        return css`
          background-color: var(--color-red-100);
        `;
      }
    }
  }}
`;

const Question = styled.p`
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  font-weight: 700;

  ${({ $variant, $isAnswered }) =>
    $variant === "design-2" &&
    $isAnswered &&
    css`
      display: none;
    `}
`;

const ButtonsRow = styled(Row)`
  gap: 2rem;
  flex-grow: 1;

  ${({ $variant }) => $variant === "design-2" && css``}
`;

const ActionButton = styled(Button)`
  text-transform: uppercase;
  max-width: 100%;
  padding: 1.3rem 2rem;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  width: 100%;

  ${({ $variant }) => {
    if ($variant === "design-2") {
      return css`
        margin-bottom: 0;
      `;
    }
  }}

  ${({ $variant, $variation }) => {
    if ($variant === "design-2" && $variation === "constGrey") {
      return css``;
    } else if ($variant === "design-2" && $variation !== "constGrey") {
    }
  }}
`;

const Answer = styled.span`
  display: inline-block;
  font-size: var(--font-size-base);
  padding: 0.2rem 1rem;
  font-weight: 500;
  text-align: center;

  ${({ $variant }) => {
    if ($variant === "design-2") {
      return css``;
    }
  }}

  ${(props) =>
    props.$didIt === "yes"
      ? css`
          background-color: var(--color-green-100);
          border: 1px solid var(--color-green-700);
          color: var(--color-green-700);
        `
      : css`
          background-color: var(--color-red-100);
          border: 1px solid var(--color-red-700);
          color: var(--color-red-800);
        `}

  ${({ $variant, $didIt }) => {
    if ($variant === "design-2") {
      return $didIt === "yes"
        ? css`
            background-color: transparent;
            border: none;
            color: var(--color-green-700);
          `
        : css`
            background-color: transparent;
            border: none;
            color: var(--color-red-800);
          `;
    }
  }}
`;

const SpinnerMiniCenter = styled(SpinnerMini)`
  text-align: center;
  margin-inline: auto;
`;

const StyledWrapper = withVariant(Wrapper);
const StyledQuestion = withVariant(Question);
const StyledButtonsRow = withVariant(ButtonsRow);
const StyledActionButton = withVariant(ActionButton);
const StyledAnswer = withVariant(Answer);

export default function HabitActionButtons({
  habitID,
  isAnswered,
  didIt,
  variant,
}) {
  const { addDailyAction, isAnswering } = useAddAction();
  const { isUpdating } = useUpdateAction();

  function handleAnswer(answer) {
    addDailyAction({ habitID, answer });
  }

  return (
    <VariantContext.Provider value={variant}>
      <StyledWrapper $didIt={didIt} className="action-buttons">
        <StyledQuestion $isAnswered={isAnswered}>
          Did you do this today?
        </StyledQuestion>

        {!isAnswered && !isAnswering && !isUpdating && (
          <StyledButtonsRow type="horizontal">
            <StyledActionButton
              onClick={() => handleAnswer("yes")}
              disabled={isAnswering}
            >
              Yes
            </StyledActionButton>
            <StyledActionButton
              $variation="constGrey"
              onClick={() => handleAnswer("no")}
              disabled={isAnswering}
            >
              No
            </StyledActionButton>
          </StyledButtonsRow>
        )}

        {isAnswered && !isUpdating && (
          <StyledAnswer $didIt={didIt}>
            {capitalizeString(didIt)},{" "}
            {didIt === "yes" ? "you did it!" : "you didn't."}
          </StyledAnswer>
        )}

        {(isAnswering || isUpdating) && <SpinnerMiniCenter />}
      </StyledWrapper>
    </VariantContext.Provider>
  );
}
