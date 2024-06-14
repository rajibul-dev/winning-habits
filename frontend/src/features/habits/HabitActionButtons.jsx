import styled, { css } from "styled-components";
import Row from "../../ui/Row.jsx";
import Button from "../../ui/Button.jsx";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import useUpdateAction from "./useUpdateAction.js";
import useAddAction from "./useAddAction.js";
import { capitalizeString } from "../../utils/capitalizeString.js";

const Wrapper = styled(Row)``;

const Question = styled.p`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 700;
`;

const ButtonsRow = styled(Row)`
  gap: 2rem;
  flex-grow: 1;
`;

const ActionButton = styled(Button)`
  text-transform: uppercase;
  max-width: 100%;
  padding: 1.3rem 2rem;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  width: 100%;
`;

const Answer = styled.span`
  display: inline-block;
  font-size: 1.6rem;
  padding: 0.2rem 1rem;
  font-weight: 500;
  text-align: center;

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
`;

export default function HabitActionButtons({ habitID, isAnswered, didIt }) {
  const { addDailyAction, isAnswering } = useAddAction();
  const { isUpdating } = useUpdateAction();

  function handleAnswer(answer) {
    addDailyAction({ habitID, answer });
  }

  return (
    <Wrapper className="action-buttons">
      <Question>Did you do this today?</Question>

      {!isAnswered && !isAnswering && !isUpdating && (
        <ButtonsRow type="horizontal">
          <ActionButton
            onClick={() => handleAnswer("yes")}
            disabled={isAnswering}
          >
            Yes
          </ActionButton>
          <ActionButton
            $variation="constGrey"
            onClick={() => handleAnswer("no")}
            disabled={isAnswering}
          >
            No
          </ActionButton>
        </ButtonsRow>
      )}

      {isAnswered && !isUpdating && (
        <Answer $didIt={didIt}>
          {capitalizeString(didIt)},{" "}
          {didIt === "yes" ? "you did it!" : "you didn't."}
        </Answer>
      )}

      {(isAnswering || isUpdating) && <SpinnerMiniCenter />}
    </Wrapper>
  );
}

const SpinnerMiniCenter = styled(SpinnerMini)`
  text-align: center;
  margin-inline: auto;
`;
