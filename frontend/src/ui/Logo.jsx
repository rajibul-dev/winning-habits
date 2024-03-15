import styled from "styled-components";
import TrophyIcon from "../assets/trophy-icon.svg";

const StyledLogo = styled.span`
  /* display: inline-block; */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
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
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: 0.3pt;
`;

const SecondWord = styled.span`
  display: inline-block;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 0.3pt;
  transform: translateX(0.6px);
`;

export default function Logo() {
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
