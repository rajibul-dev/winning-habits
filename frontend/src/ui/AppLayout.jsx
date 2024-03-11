import { Outlet } from "react-router-dom";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  height: 100dvh;
`;

export default function AppLayout() {
  return (
    <StyledAppLayout>
      <Outlet />
    </StyledAppLayout>
  );
}
