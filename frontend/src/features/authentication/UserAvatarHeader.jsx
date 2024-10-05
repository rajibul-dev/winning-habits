import styled from "styled-components";
import useUser from "./useUser.js";
import Menus from "../../ui/Menu.jsx";
import { TiArrowSortedDown } from "react-icons/ti";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import useLogout from "./useLogout.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import { useNavigate } from "react-router-dom";
import useViewportLessThan from "../../hooks/useViewportLessThan.js";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: var(--font-size-sm);
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;
const Name = styled.span`
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-grey-500);
`;

function UserAvatarHeader() {
  const { user } = useUser();
  const { name, avatar } = user;
  const { logout, isLoggingOut } = useLogout();
  const navigate = useNavigate();
  const shouldHideUserName = useViewportLessThan(540);

  return (
    <Menus>
      <Menus.Toggle id="account dropdown" type="container">
        <StyledUserAvatar>
          <Avatar
            src={avatar || "default-user.jpg"}
            alt={`Avatar of ${name}`}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          {!shouldHideUserName && <Name>{name}</Name>}
          <TiArrowSortedDown
            color="var(--color-grey-500)"
            style={{
              marginLeft: "-0.6rem",
            }}
          />
        </StyledUserAvatar>
      </Menus.Toggle>
      <Menus.List isTopOfHeader={true} id="account dropdown">
        <Menus.Button
          onClick={() => navigate("/app/profile")}
          icon={<FaUser />}
        >
          Profile
        </Menus.Button>
        <Menus.Button
          onClick={logout}
          icon={!isLoggingOut ? <RiLogoutCircleLine /> : <SpinnerMini />}
        >
          Logout
        </Menus.Button>
      </Menus.List>
    </Menus>
  );
}

export default UserAvatarHeader;
