import styled from "styled-components";
import UserAvatarHeader from "../features/authentication/UserAvatarHeader.jsx";
import HeaderMenu from "./HeaderMenu.jsx";

const StyledHeader = styled.header`
  grid-area: header;
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
`;

export default function Header() {
  return (
    <StyledHeader>
      <HeaderMenu />
      <UserAvatarHeader />
    </StyledHeader>
  );
}
