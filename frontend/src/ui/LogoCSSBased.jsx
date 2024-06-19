import styled from "styled-components";
import TrophyIcon from "../assets/trophy-icon.svg";

const StyledLogo = styled.span`
  /* display: inline-block; */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: uppercase;
  line-height: 0.9;
  text-align: center;
`;
const TextWrapper = styled.div``;

const StyledTrophyIcon = styled.img`
  /* width: 7rem; */
  width: 2.95rem;
`;

const FirstWord = styled.span`
  display: inline-block;
  font-size: var(--font-size-lg);
  font-weight: 500;
  letter-spacing: 0.3pt;
`;

const SecondWord = styled.span`
  display: inline-block;
  font-size: var(--font-size-xlg);
  font-weight: 900;
  letter-spacing: 0.3pt;
  transform: translateX(0.06rem);
`;

export default function LogoCSSBased() {
  return (
    <StyledLogo>
      <StyledTrophyIcon src={TrophyIcon} alt="trophy icon" />
      <TextWrapper>
        <FirstWord>Winning</FirstWord>
        <br />
        <SecondWord>Habits</SecondWord>
      </TextWrapper>
    </StyledLogo>
  );
}
