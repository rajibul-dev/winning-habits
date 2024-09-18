import { IoSparkles } from "react-icons/io5";
import StatCard from "../../ui/StatCard.jsx";
import { PiFireSimpleFill } from "react-icons/pi";
import styled from "styled-components";

const PointsWrapper = styled.div`
  grid-row: 2 / 3;
  grid-column: 1 / span 2;
  align-self: center;
`;

const StreakWrapper = styled.div`
  grid-row: 2 / 3;
  grid-column: 3 / span 2;
  align-self: center;
`;

export default function HabitStatistics({
  totalPoints,
  isAnswered,
  streakFireColor,
  streak,
  isAchieved,
}) {
  return (
    <>
      <PointsWrapper $isAchieved={isAchieved}>
        <StatCard
          icon={
            <IoSparkles
              color={
                isAchieved
                  ? "var(--achievement-gold-color--shine-2)"
                  : `var(--color-yellow-400)`
              }
            />
          }
          value={totalPoints}
          label="Points"
          goldFlex={isAchieved}
        />
      </PointsWrapper>

      <StreakWrapper $isAchieved={isAchieved}>
        <StatCard
          icon={
            <PiFireSimpleFill
              color={
                isAchieved
                  ? "var(--achievement-gold-color--shine-2)"
                  : isAnswered
                    ? streakFireColor
                    : `var(--color-grey-300)`
              }
            />
          }
          value={streak}
          label="Day streak"
          goldFlex={isAchieved}
        />
      </StreakWrapper>
    </>
  );
}
