import styled, { css } from "styled-components";
import Row from "../../ui/Row.jsx";
import Button from "../../ui/Button.jsx";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import useUpdateAction from "./useUpdateAction.js";
import useAddAction from "./useAddAction.js";
import { createContext, useContext } from "react";
import { pixelToEm } from "../../styles/GlobalStyles.js";

const VariantContext = createContext();

const withVariant = (Component) => (props) => {
  const variant = useContext(VariantContext);
  return <Component {...props} $variant={variant} />;
};

const Wrapper = styled(Row)`
  position: relative;
  overflow: hidden;
  border-radius: 2.4rem;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  background-image: radial-gradient(
    circle at top left,
    var(--habit-brand-tint),
    transparent 42%
  );
  box-shadow: var(--shadow-sm);
  padding: 1.4rem 1.6rem;
  gap: 1.4rem;

  ${({ $variant }) =>
    $variant === "design-2" &&
    css`
      min-height: 100%;
      width: 100%;
      padding: 2.2rem 2.4rem 2.4rem;
      justify-content: center;
      gap: 1.6rem;
      text-align: center;
      border-radius: 2.6rem;
    `}

  @media (max-width: ${pixelToEm(1100)}) {
    ${({ $variant }) =>
      $variant !== "design-2" &&
      css`
        padding: 1rem 0.4rem;
      `}
  }

  ${({ $variant, $didIt }) => {
    if ($variant !== "design-2" || $didIt === "unanswered") return css``;

    if ($didIt === "yes") {
      return css`
        border-color: var(--color-green-700);
        background-color: var(--color-green-100);
        background-image: none;
      `;
    } else if ($didIt === "no") {
      return css`
        border-color: var(--color-red-700-mod);
        background-color: var(--color-red-100);
        background-image: none;
      `;
    }
  }}

  @media (max-width: ${pixelToEm(500)}) {
    border-radius: 2rem;
  }
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: fit-content;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background-color: var(--color-grey-100);
  color: var(--color-grey-500);
  font-size: var(--font-size-xsm);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Question = styled.p`
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-grey-700);
  text-align: center;

  ${({ $variant }) =>
    $variant === "design-2" &&
    css`
      font-size: clamp(2rem, 2vw, 2.6rem);
      font-weight: 800;
      color: var(--color-grey-800);
      letter-spacing: -0.02em;
    `}

  ${({ $variant, $isAnswered }) =>
    $variant === "design-2" &&
    $isAnswered &&
    css`
      display: none;
    `}

  ${({ $variant }) =>
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
    `}
`;

const HelperText = styled.p`
  display: none;

  ${({ $variant, $isAnswered }) =>
    $variant === "design-2" &&
    !$isAnswered &&
    css`
      display: block;
      margin-top: -0.4rem;
      color: var(--color-grey-500);
      font-size: var(--font-size-base);
      line-height: 1.45;
      max-width: 28rem;
      margin-inline: auto;
    `}
`;

const ButtonsRow = styled(Row)`
  gap: 1.2rem;
  flex-grow: 1;
  width: 100%;

  ${({ $variant }) =>
    $variant === "design-2" &&
    css`
      flex-grow: 0;
      justify-content: center;
    `}

  @media (max-width: ${pixelToEm(500)}) {
    gap: 1rem;
  }
`;

const ActionButton = styled(Button)`
  text-transform: uppercase;
  max-width: 100%;
  padding: 1.3rem 2rem;
  font-size: 1.3rem;
  font-weight: 700;
  width: 100%;

  ${({ $variant }) =>
    $variant === "design-2" &&
    css`
      min-width: 12rem;
      width: auto;
      padding: 1.4rem 2.4rem;
      border-radius: 999px;
      font-size: var(--font-size-sm);
      letter-spacing: 0.08em;
    `}
`;

const Answer = styled.div`
  display: grid;
  gap: 0.45rem;
  justify-items: center;
  text-align: center;

  & .status-title {
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--color-grey-700);
  }

  & .status-note {
    color: var(--color-grey-500);
    font-size: var(--font-size-sm);
  }

  ${({ $variant }) =>
    $variant === "design-2" &&
    css`
      gap: 0.7rem;

      & .status-title {
        font-size: clamp(2rem, 2vw, 2.6rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }

      & .status-note {
        font-size: var(--font-size-base);
        max-width: 28rem;
        line-height: 1.45;
      }
    `}

  ${({ $didIt }) =>
    $didIt === "yes"
      ? css`
          & .status-title {
            color: var(--color-green-700);
          }
        `
      : css`
          & .status-title {
            color: var(--color-red-800);
          }
        `}
`;

const SpinnerMiniCenter = styled(SpinnerMini)`
  text-align: center;
  margin-inline: auto;
`;

const StyledWrapper = withVariant(Wrapper);
const StyledEyebrow = withVariant(Eyebrow);
const StyledQuestion = withVariant(Question);
const StyledHelperText = withVariant(HelperText);
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

  const answerTitle =
    didIt === "yes" ? "Yes, you did it today." : "No, you missed today.";
  const answerNote =
    didIt === "yes"
      ? "Nice work. Your streak and points are updated."
      : "That is okay. Tomorrow is a clean chance to keep momentum going.";

  return (
    <VariantContext.Provider value={variant}>
      <StyledWrapper $didIt={didIt} className="action-buttons">
        <StyledEyebrow>
          {isAnswered ? "Today logged" : "Daily check-in"}
        </StyledEyebrow>

        {!isAnswered && (
          <StyledQuestion $isAnswered={isAnswered}>
            Did you do this today?
          </StyledQuestion>
        )}

        {!isAnswered && !isAnswering && !isUpdating && (
          <StyledButtonsRow type="horizontal">
            <StyledActionButton
              onClick={() => handleAnswer("yes")}
              disabled={isAnswering}
            >
              Yes
            </StyledActionButton>
            <StyledActionButton
              $variation={variant === "design-2" ? "constRed" : "constGrey"}
              onClick={() => handleAnswer("no")}
              disabled={isAnswering}
            >
              No
            </StyledActionButton>
          </StyledButtonsRow>
        )}

        {isAnswered && !isUpdating && (
          <StyledAnswer $didIt={didIt}>
            <span className="status-title">{answerTitle}</span>
            <span className="status-note">{answerNote}</span>
          </StyledAnswer>
        )}

        {(isAnswering || isUpdating) && <SpinnerMiniCenter />}
      </StyledWrapper>
    </VariantContext.Provider>
  );
}
