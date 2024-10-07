import { Outlet } from "react-router-dom";
import styled, { css } from "styled-components";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import BottomBar from "./BottomBar.jsx";
import { pixelToEm } from "../styles/GlobalStyles.js";
import { useSelector } from "react-redux";
import { getIsShowingMainAppGuide } from "../features/app-guide/guideSlice.js";
import Modal from "./Modal.jsx";
import PresentationModal from "./PresentationModal.jsx";
import MainAppGuide from "../features/app-guide/MainAppGuide.jsx";

const StyledAppLayout = styled.div`
  display: grid;
  height: 100dvh;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;

  grid-template-areas: "sidebar header" "sidebar content";

  ${({ $isMobile }) =>
    $isMobile &&
    css`
      grid-template-areas: "header header" "content content" "bottom-bar bottom-bar";
    `}
`;

const mobileSideSpacing = `3rem`;
const thinMobileSideSpacing = `2rem`;

const Main = styled.main`
  grid-area: content;
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: auto;
  overflow-x: hidden;

  ${({ $isMobile }) =>
    $isMobile &&
    css`
      padding-inline: ${mobileSideSpacing};
    `}

  @media (max-width: ${pixelToEm(355)}) {
    padding-inline: ${thinMobileSideSpacing};
  }
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

export default function AppLayout() {
  const isMobile = useIsMobile();

  const isShowingMainAppGuide = useSelector(getIsShowingMainAppGuide);
  // const isShowingMainAppGuide = true;

  return (
    <>
      {isShowingMainAppGuide && (
        <PresentationModal>
          <MainAppGuide />
        </PresentationModal>
      )}

      <StyledAppLayout $isMobile={isMobile}>
        <Header isMobile={isMobile} />

        {!isMobile && <Sidebar />}

        <Main $isMobile={isMobile}>
          <Container>
            <Outlet />
          </Container>
        </Main>

        {isMobile && <BottomBar />}
      </StyledAppLayout>
    </>
  );
}
