import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { pixelToEm } from "../styles/GlobalStyles.js";

const StyledItem = styled.li`
  list-style: none;
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 1.6rem;
  align-items: center;
  padding: 1.8rem 2rem;
  background:
    linear-gradient(180deg, rgba(99, 102, 241, 0.04), transparent 60%),
    var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 2rem;
  box-shadow: var(--shadow-sm);

  ${({ $isInteractive }) =>
    $isInteractive &&
    css`
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        border-color: var(--color-brand-200);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }
    `}

  @media (max-width: ${pixelToEm(500)}) {
    padding-inline: 1.6rem;
    gap: 1.2rem;
  }
`;

const AvatarShell = styled.div`
  width: 6rem;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(
    135deg,
    var(--color-brand-500),
    var(--color-blue-700)
  );
  box-shadow: 0 0.8rem 2rem rgba(79, 70, 229, 0.18);

  @media (max-width: ${pixelToEm(500)}) {
    width: 5.2rem;
  }
`;

const Avatar = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
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
  color: var(--color-grey-700);
  font-size: var(--font-size-lg);
  font-weight: 700;
  text-transform: uppercase;
`;

const Content = styled.div`
  min-width: 0;
`;

const NameRow = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Name = styled.p`
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--color-grey-800);
`;

const SecondaryText = styled.p`
  margin-top: 0.4rem;
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
  line-height: 1.45;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
  font-size: var(--font-size-xsm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Trailing = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--color-grey-400);
`;

const Chevron = styled(FiChevronRight)`
  width: 1.8rem;
  height: 1.8rem;
  flex-shrink: 0;
`;

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export default function UserListItem({
  user,
  secondaryText = "Add a short rank, status, or note here.",
  badge,
  to,
  onClick,
  trailing,
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const isInteractive = Boolean(to || onClick);
  const component = to ? Link : onClick ? "button" : "div";
  const showAvatarImage = user?.avatar && !hasImageError;
  const cardProps = {
    as: component,
    onClick,
    type: component === "button" ? "button" : undefined,
    $isInteractive: isInteractive,
  };

  if (to) cardProps.to = to;

  return (
    <StyledItem>
      <Card {...cardProps}>
        <AvatarShell>
          {showAvatarImage ? (
            <Avatar
              src={user.avatar}
              alt={`Avatar of ${user.name}`}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          )}
        </AvatarShell>

        <Content>
          <NameRow>
            <Name>{user?.name}</Name>
            {badge ? <Badge>{badge}</Badge> : null}
          </NameRow>
          <SecondaryText>{secondaryText}</SecondaryText>
        </Content>

        <Trailing>
          {trailing}
          {isInteractive ? <Chevron aria-hidden="true" /> : null}
        </Trailing>
      </Card>
    </StyledItem>
  );
}
