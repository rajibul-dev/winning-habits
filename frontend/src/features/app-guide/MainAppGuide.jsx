import styled from "styled-components";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { toggleMainGuide } from "./guideSlice";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const TextCanvas = styled.div`
  width: 100%;
  height: 68dvh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ButtonWrapper = styled.div``;

export default function MainAppGuide() {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <TextCanvas>My beautiful content will go here</TextCanvas>
      <ButtonWrapper>
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleMainGuide());
          }}
        >
          Okay
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
