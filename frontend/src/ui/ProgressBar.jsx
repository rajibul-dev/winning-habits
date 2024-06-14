import { motion } from "framer-motion";
import styled, { css } from "styled-components";

const StyledProgressBar = styled.div`
  height: 2rem;
  background-color: var(--color-grey-200);
  position: relative;
  border-radius: var(--border-radius-lg);
  width: 100%;
`;

const ProgressValue = styled(motion.span)`
  display: inline-block;
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: var(--border-radius-lg);
  background-color: var(--color-lime-500);

  ${({ streak }) =>
    streak >= 7 &&
    streak <= 20 &&
    css`
      background-color: var(--color-yellow-400);
    `}

  ${({ streak }) =>
    streak >= 21 &&
    css`
      background-color: var(--color-orange-500);
      box-shadow:
        0 -7px 0 var(--color-orange-500-shadow),
        0 7px 0 var(--color-orange-500-shadow);
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
`;
const EndValueNum = styled.span`
  ${valueNumStyles}
  right: .5rem;
`;

export default function ProgressBar({
  percentage,
  streak,
  startValueNum,
  endValueNum,
}) {
  return (
    <StyledProgressBar>
      <ProgressValue
        initial={{
          width: 0,
        }}
        animate={{
          width: `${percentage}%`,
        }}
        streak={streak}
      />
      <StartValueNum>{startValueNum}</StartValueNum>
      <EndValueNum>{endValueNum}</EndValueNum>
    </StyledProgressBar>
  );
}
