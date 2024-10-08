import styled, { css } from "styled-components";
import Row from "../../ui/Row.jsx";
import Button from "../../ui/Button.jsx";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import useUpdateAction from "./useUpdateAction.js";
import useAddAction from "./useAddAction.js";
import { capitalizeString } from "../../utils/capitalizeString.js";
import { createContext, useContext } from "react";
import { pixelToEm } from "../../styles/GlobalStyles.js";

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
      height: 100%;
      width: 100%;
      padding: 1rem 3rem;
      margin: 0 auto;
      justify-content: center;
      gap: 1.6rem;
    `}

  ${({ $variant, $didIt }) => {
    if ($variant === "design-2" && $didIt !== "unanswered") {
      if ($didIt === "yes") {
        return css`
          // TODO: find better design for this
          background-color: var(--color-green-100);
          /* background-color: var(--color-const-green-700); */
        `;
      } else if ($didIt === "no") {
        return css`
          // TODO: find better design for this
          background-color: var(--color-red-100);
          /* background-color: var(--color-const-red-800); */
        `;
      }
    }
  }}
`;

const Question = styled.p`
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  font-weight: 700;

  ${({ $variant }) =>
    $variant === "design-2" &&
    css`
      font-weight: 800;
      text-align: center;
      font-size: 2rem;
    `}

  ${({ $variant, $isAnswered }) =>
    $variant === "design-2" &&
    $isAnswered &&
    css`
      display: none;
    `}

    
    ${({ $variant }) => {
    $variant !== "design-2" &&
      css`
        @media (max-width: ${pixelToEm(1200)}) and (min-width: ${pixelToEm(
            1100,
          )}) {
          font-size: 1.1rem;
        }
        @media (max-width: ${pixelToEm(430)}) {
          font-size: 1.3rem;
        }
      `;
  }}
`;

const ButtonsRow = styled(Row)`
  gap: 2rem;
  flex-grow: 1;

  ${({ $variant }) =>
    $variant === "design-2" &&
    css`
      flex-grow: 0;
    `}
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
      return css`
        font-size: 2rem;
        text-transform: uppercase;
        font-weight: 800;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      `;
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
            /* color: var(--color-const-green-100); */
          `
        : css`
            background-color: transparent;
            border: none;
            color: var(--color-red-800);
            /* color: var(--color-const-red-100); */
          `;
    }
  }}

  ${({ $variant }) => {
    $variant !== "design-2" &&
      css`
        @media (max-width: ${pixelToEm(430)}) {
          font-size: 1.5rem;
        }
      `;
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
            {didIt === "yes"
              ? `you did it${variant === "design-2" ? ` today!` : `!`}`
              : `you didn't${variant === "design-2" ? ` do it today.` : `.`}`}
          </StyledAnswer>
        )}

        {(isAnswering || isUpdating) && <SpinnerMiniCenter />}
      </StyledWrapper>
    </VariantContext.Provider>
  );
}
