import { PiFireSimpleFill } from "react-icons/pi";
import styled, { css } from "styled-components";

const Streak = styled.div`
  position: relative;
  transform: translateX(8rem);

  & span {
    font-size: 3.6rem;
    font-weight: 700;
    display: inline-block;
    color: var(--color-grey-500);
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    transform: translate(-50%, -42%);

    ${(props) =>
      props.answer === "yes" &&
      css`
        color: white;
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
      `}
  }

  & svg {
    font-size: 11rem;
    fill: var(--color-grey-300);
    transform: translateY(2px);

    ${(props) =>
      props.answer === "yes" &&
      props.streak >= 1 &&
      props.streak <= 6 &&
      css`
        fill: var(--color-lime-500);
      `}

    ${(props) =>
      props.answer === "yes" &&
      props.streak >= 7 &&
      props.streak <= 13 &&
      css`
        fill: var(--color-amber-500);
      `}

    ${(props) =>
      props.answer === "yes" &&
      props.streak >= 14 &&
      css`
        fill: var(--color-orange-500);
      `}
  }
`;

export default function StreakFire({ streak, didIt }) {
  return (
    <Streak streak={streak} answer={didIt}>
      <span>{streak}</span>
      <PiFireSimpleFill />
    </Streak>
  );
}
