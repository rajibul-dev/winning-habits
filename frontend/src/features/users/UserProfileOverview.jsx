import { useState } from "react";
import styled, { css } from "styled-components";
import Heading from "../../ui/Heading.jsx";
import { pixelToEm } from "../../styles/GlobalStyles.js";

const PageStack = styled.div`
  display: grid;
  gap: 2.4rem;
`;

const HeroCard = styled.section`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 2.8rem;
  align-items: center;
  padding: 3rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 3.2rem;
  background:
    radial-gradient(circle at top left, var(--habit-brand-tint), transparent 34%),
    linear-gradient(
      180deg,
      var(--habit-surface-soft-strong),
      var(--color-grey-0)
    );
  box-shadow: var(--shadow-md);

  @media (max-width: ${pixelToEm(800)}) {
    grid-template-columns: 1fr;
    text-align: center;
  }

  @media (max-width: ${pixelToEm(500)}) {
    padding: 2.2rem;
    border-radius: 2.4rem;
  }
`;

const AvatarFrame = styled.div`
  width: 18rem;
  aspect-ratio: 1;
  padding: 0.45rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-brand-500),
    var(--color-blue-700)
  );
  box-shadow: 0 1.8rem 4rem rgba(79, 70, 229, 0.18);

  @media (max-width: ${pixelToEm(800)}) {
    justify-self: center;
  }

  @media (max-width: ${pixelToEm(500)}) {
    width: 15.5rem;
  }
`;

const AvatarImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  background-color: var(--color-grey-100);
`;

const AvatarFallback = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-grey-100),
    var(--color-grey-200)
  );
  color: var(--color-grey-800);
  font-size: 5.2rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const Copy = styled.div`
  min-width: 0;
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
  font-size: var(--font-size-xsm);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Name = styled(Heading)`
  margin-top: 1.4rem;
  color: var(--color-grey-800);
  font-size: clamp(3.2rem, 4vw, 4.8rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.06em;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 1.2rem;
  color: var(--color-grey-500);

  @media (max-width: ${pixelToEm(800)}) {
    justify-content: center;
  }
`;

const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 3.2rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background-color: var(--color-grey-100);
  border: 1px solid var(--color-grey-200);
  color: var(--color-grey-600);
  font-size: var(--font-size-sm);
  font-weight: 600;
`;

const Description = styled.p`
  max-width: 62ch;
  margin-top: 1.6rem;
  color: var(--color-grey-600);
  font-size: var(--font-size-lg);
  line-height: 1.6;

  @media (max-width: ${pixelToEm(800)}) {
    margin-inline: auto;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (max-width: ${pixelToEm(800)}) {
    justify-content: center;
  }
`;

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.4rem;

  @media (max-width: ${pixelToEm(900)}) {
    grid-template-columns: 1fr;
  }
`;

const toneStyles = {
  brand: css`
    background:
      radial-gradient(circle at top right, var(--habit-brand-tint), transparent 48%),
      var(--color-grey-0);

    & .icon-shell {
      background-color: var(--color-brand-100);
      color: var(--color-brand-700);
    }
  `,
  success: css`
    background:
      radial-gradient(circle at top right, rgba(21, 128, 61, 0.1), transparent 45%),
      var(--color-grey-0);

    & .icon-shell {
      background-color: var(--color-green-100);
      color: var(--color-green-700);
    }
  `,
  warning: css`
    background:
      radial-gradient(circle at top right, rgba(245, 158, 11, 0.14), transparent 45%),
      var(--color-grey-0);

    & .icon-shell {
      background-color: var(--color-yellow-100);
      color: var(--color-yellow-700);
    }
  `,
  neutral: css`
    background: var(--color-grey-0);

    & .icon-shell {
      background-color: var(--color-grey-100);
      color: var(--color-grey-700);
    }
  `,
};

const StatCard = styled.article`
  display: grid;
  gap: 1.4rem;
  padding: 2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 2.2rem;
  box-shadow: var(--shadow-sm);

  ${(props) => toneStyles[props.$tone || "neutral"]}
`;

const StatTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
`;

const StatLabel = styled.p`
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const IconShell = styled.div`
  display: grid;
  place-items: center;
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 1.4rem;

  & svg {
    width: 2.2rem;
    height: 2.2rem;
  }
`;

const StatValue = styled.p`
  color: var(--color-grey-800);
  font-size: clamp(3.2rem, 4vw, 4rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
`;

const StatCaption = styled.p`
  color: var(--color-grey-500);
  line-height: 1.5;
`;

const SpotlightCard = styled.section`
  padding: 2.2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 2.6rem;
  background:
    radial-gradient(circle at top right, var(--habit-brand-tint), transparent 28%),
    var(--color-grey-0);
  box-shadow: var(--shadow-sm);

  @media (max-width: ${pixelToEm(500)}) {
    padding: 1.8rem;
  }
`;

const SectionHeading = styled(Heading)`
  color: var(--color-grey-800);
`;

const SectionIntro = styled.p`
  margin-top: 0.8rem;
  color: var(--color-grey-500);
`;

const HabitList = styled.ul`
  display: grid;
  gap: 1.2rem;
  margin-top: 1.8rem;
`;

const HabitItem = styled.li`
  display: grid;
  gap: 0.8rem;
  padding: 1.4rem 1.6rem;
  border: 1px solid var(--habit-surface-border-soft);
  border-radius: 1.8rem;
  background-color: var(--habit-surface-soft);
`;

const HabitTopRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const HabitName = styled.p`
  color: var(--color-grey-800);
  font-size: var(--font-size-lg);
  font-weight: 700;
`;

const HabitStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: var(--font-size-xsm);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background-color: ${({ $status }) =>
    $status === "Completed"
      ? "var(--color-green-100)"
      : $status === "Strong"
        ? "var(--color-yellow-100)"
        : $status === "Archived"
          ? "var(--color-grey-100)"
          : "var(--color-brand-100)"};
  color: ${({ $status }) =>
    $status === "Completed"
      ? "var(--color-green-700)"
      : $status === "Strong"
        ? "var(--color-yellow-700)"
        : $status === "Archived"
          ? "var(--color-grey-600)"
          : "var(--color-brand-700)"};
`;

const HabitMetrics = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const MetricPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 3rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  color: var(--color-grey-600);
  font-size: var(--font-size-sm);
  font-weight: 600;
`;

const EmptyText = styled.p`
  margin-top: 1.8rem;
  padding: 1.6rem;
  border-radius: 1.8rem;
  background-color: var(--habit-surface-soft);
  color: var(--color-grey-500);
`;

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function getHabitStatus(habit) {
  if (habit?.habitStatus === "strong") return "Completed";
  if (habit?.isProfileStrong) return "Strong";
  if (habit?.isArchived) return "Archived";
  return "Active";
}

export default function UserProfileOverview({
  user,
  headerLabel,
  description,
  metaItems = [],
  stats = [],
  actions,
  habits = [],
  habitsTitle = "Habit spotlight",
  habitsIntro = "A quick view of the habits making the strongest impression right now.",
  emptyHabitsText = "No habits to show yet.",
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const showAvatarImage = user?.avatar && !hasImageError;

  return (
    <PageStack>
      <HeroCard>
        <AvatarFrame>
          {showAvatarImage ? (
            <AvatarImage
              src={user.avatar}
              alt={`Avatar of ${user.name}`}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          )}
        </AvatarFrame>

        <Copy>
          <Eyebrow>{headerLabel}</Eyebrow>
          <Name as="h1">{user?.name || "Unnamed user"}</Name>

          {metaItems.length ? (
            <MetaRow>
              {metaItems.map((item) => (
                <MetaPill key={item}>{item}</MetaPill>
              ))}
            </MetaRow>
          ) : null}

          <Description>{description}</Description>

          {actions ? <ActionsRow>{actions}</ActionsRow> : null}
        </Copy>
      </HeroCard>

      {stats.length ? (
        <StatsGrid>
          {stats.map((stat) => (
            <StatCard key={stat.label} $tone={stat.tone}>
              <StatTopRow>
                <StatLabel>{stat.label}</StatLabel>
                {stat.icon ? (
                  <IconShell className="icon-shell">{stat.icon}</IconShell>
                ) : null}
              </StatTopRow>
              <StatValue>{stat.value}</StatValue>
              <StatCaption>{stat.caption}</StatCaption>
            </StatCard>
          ))}
        </StatsGrid>
      ) : null}

      <SpotlightCard>
        <SectionHeading as="h2">{habitsTitle}</SectionHeading>
        <SectionIntro>{habitsIntro}</SectionIntro>

        {habits.length ? (
          <HabitList>
            {habits.map((habit) => {
              const status = getHabitStatus(habit);

              return (
                <HabitItem key={habit._id}>
                  <HabitTopRow>
                    <HabitName>{habit.name}</HabitName>
                    <HabitStatus $status={status}>{status}</HabitStatus>
                  </HabitTopRow>

                  <HabitMetrics>
                    <MetricPill>
                      {habit.totalPoints || 0} point
                      {(habit.totalPoints || 0) === 1 ? "" : "s"}
                    </MetricPill>
                    <MetricPill>{habit.streak || 0} day streak</MetricPill>
                    <MetricPill>
                      {(habit.dailyRecords || []).length} check-in
                      {(habit.dailyRecords || []).length === 1 ? "" : "s"}
                    </MetricPill>
                  </HabitMetrics>
                </HabitItem>
              );
            })}
          </HabitList>
        ) : (
          <EmptyText>{emptyHabitsText}</EmptyText>
        )}
      </SpotlightCard>
    </PageStack>
  );
}

