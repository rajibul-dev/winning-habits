import { motion } from "framer-motion";
import styled from "styled-components";

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
  background-color: ${({ barColor }) => barColor || "var(--color-lime-500)"};
  box-shadow: ${({ barGlow }) => barGlow || "none"};
`;

export default function ProgressBar({ percentage, barColor, barGlow }) {
  return (
    <StyledProgressBar>
      <ProgressValue
        initial={{
          width: 0,
        }}
        animate={{
          width: `${percentage}%`,
        }}
        barColor={barColor}
        barGlow={barGlow}
      />
    </StyledProgressBar>
  );
}
