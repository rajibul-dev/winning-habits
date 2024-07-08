import { PiFireSimpleFill } from "react-icons/pi";
import styled, { css } from "styled-components";
import streakColor from "./streakColor.js";

const Streak = styled.div`
  position: relative;

  & span {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    display: inline-block;
    color: var(--color-grey-500);
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    transform: translate(-50%, -42%);

    ${(props) =>
      props.$answer === "yes" &&
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
      props.$answer === "yes" &&
      props.$streak !== 0 &&
      css`
        fill: ${streakColor(props.$streak)};
      `}

    ${(props) =>
      props.$answer === "yes" &&
      props.$streak >= 21 &&
      css`
        filter: drop-shadow(0 0 7px var(--color-orange-500-shadow-2));
      `}
  }
`;

export default function StreakFire({ streak, didIt }) {
  return (
    <Streak $streak={streak} $answer={didIt}>
      <span>{streak}</span>
      <PiFireSimpleFill />
    </Streak>
  );
}
