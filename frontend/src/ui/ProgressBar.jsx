import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import { useDarkMode } from "../context/DarkModeContext.jsx";
import streakColor from "../features/habits/streakColor.js";

const StyledProgressBar = styled.div`
  height: 2rem;
  background-color: var(--color-grey-200);
  position: relative;
  border-radius: var(--border-radius-lg);
  width: 100%;
  overflow: visible;

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      background-color: var(--achievement-gold-color--shine);
      box-shadow: none;
    `}
`;

const ProgressValue = styled(motion.div)`
  display: inline-block;
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: var(--border-radius-lg);
  background-color: ${({ streak }) => streakColor(streak)};

  ${({ streak }) =>
    streak >= 21 &&
    css`
      box-shadow: 0 0 0 5px var(--color-orange-500-shadow);
    `};

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      background-color: var(--achievement-gold-color--shine);
      box-shadow: 0 0 0 5px var(--achievement-gold-color--shadow-2);
    `}
`;

const valueNumStyles = css`
  z-index: 2;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 500;
  color: var(--color-grey-900);
`;
const StartValueNum = styled.span`
  ${valueNumStyles}
  left: .5rem;

  ${({ $isDarkMode, $percentage }) => {
    if (!$isDarkMode && $percentage >= 2) {
      return css`
        color: var(--color-grey-50);
      `;
    }
  }}

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      color: var(--achievement-gold-color--shade);
    `}
`;
const EndValueNum = styled.span`
  ${valueNumStyles}
  right: .5rem;

  ${({ $isDarkMode, $percentage }) => {
    if (!$isDarkMode && $percentage >= 99) {
      return css`
        color: var(--color-grey-50);
      `;
    }
  }}

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      color: var(--achievement-gold-color--shade);
    `}
`;

export default function ProgressBar({
  percentage,
  streak,
  startValueNum,
  endValueNum,
  isAchieved,
}) {
  const { isDarkMode } = useDarkMode();
  const cookedPercentage = percentage > 100 ? 100 : percentage;

  return (
    <StyledProgressBar streak={streak} $isAchieved={isAchieved}>
      <ProgressValue
        initial={{
          width: 0,
        }}
        animate={{
          width: `${cookedPercentage}%`,
        }}
        streak={streak}
        $isAchieved={isAchieved}
      />

      <StartValueNum
        $isAchieved={isAchieved}
        $percentage={cookedPercentage}
        $isDarkMode={isDarkMode}
      >
        {startValueNum}
      </StartValueNum>

      <EndValueNum
        $isAchieved={isAchieved}
        $percentage={cookedPercentage}
        $isDarkMode={isDarkMode}
      >
        {endValueNum}
      </EndValueNum>
    </StyledProgressBar>
  );
}
