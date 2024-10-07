import styled from "styled-components";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { toggleMainGuide } from "./guideSlice";
import Heading from "../../ui/Heading";
import { pixelToEm } from "../../styles/GlobalStyles";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
`;

const TextCanvas = styled.div`
  width: 100%;
  height: 68dvh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ModifiedH2 = styled(Heading)`
  margin-bottom: 1.4rem;

  &:not(:first-child) {
    margin-top: 2.5rem;
  }

  @media (min-width: ${pixelToEm(430)}) {
    padding-right: 2rem;
  }
`;

const Paragraph = styled.p`
  font-size: var(--font-size-base);
  line-height: 1.7;
  hyphens: none;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  @media (min-width: ${pixelToEm(430)}) {
    padding-right: 2rem;
  }

  & strong {
    font-weight: 600;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;

  & button {
    width: 100%;
  }
`;

export default function MainAppGuide() {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <TextCanvas>
        <ModifiedH2 as="h1">How to use this app?</ModifiedH2>
        <Paragraph>
          The app's purpose is to make a habit of the good things you want to
          make a habit of. Start by creating a new Habit; each day it will have
          a prompt asking you whether you did your task or not with a 'yes' and
          a 'no' button. 'Yes' will add points and update your streak! How many
          points? It will take your streak number as points to add. 'No' will
          reset the streak to 0, but the points remains the same obviously.
        </Paragraph>
        <Paragraph>
          And don't worry it's not like Duolingo where you have to visit the app
          everyday to make sure you're updating it in time, you can set the
          yeses and no's from Calendar as well that will get you the exact
          points you deserve.
        </Paragraph>
        <Paragraph>
          The goal is to reach 1,000 points, by then the app will have assumed
          you mastered the habit and there's no need to track it further so
          actively with the app as it is a second nature for you by that point
          (yet you can still do so if you wish).
        </Paragraph>

        <ModifiedH2 as="h2">Some tips</ModifiedH2>
        <Paragraph>
          <strong>Count the necessary break days as a 'yes'.</strong> For
          example, working out everyday is not recommended, but 2 to 3 break
          days on a week is rather better. Just like that, you'd know for your
          target habit which are the break days, count them as yes.
        </Paragraph>
        <Paragraph>
          <strong>Be honest with the answers.</strong> If you feel like, "why be
          honest when we can lie and say 'yes' to save the streak and point
          accumulation?"—I get you, in the future, the app may an 'add note'
          feature, with that you can add a note to your habits on a day
          instence, the note will be about what went wrong or what went well,
          why you didn't do the task etc., up to you. So, even the 'no's will
          make sense and be helpful, not to mention fake points will not do any
          good for your habit building.
        </Paragraph>
        <Paragraph>
          <strong>
            Utilize the calendar day picker for tracking the habit progress.
          </strong>{" "}
          Visiting this monotonic app everyday to press a 'yes' or a 'no' button
          will eventually feel meaningless, you can use any other tool or a
          textbook or your memory even, to store if you did the task or not, and
          then you can place them on this app when you're in the mood for it.
        </Paragraph>
        <Paragraph>
          <strong>Add the app to the homescreen.</strong> I know it's a
          web-based app but adding a web-based app to the homescreen is
          possible. Why do this? It's up to you, but you don't have to visit
          this app everyday as I mentioned in the previous point and throughout
          this text. But it can grab your attention and you don't have to keep
          it in the mind that you have to visit the app, it will be on the front
          of your device.
        </Paragraph>
        <ModifiedH2 as="h2">A message from the developer</ModifiedH2>
        <Paragraph>
          If this app becomes a success, as in many users are using it and
          finding it useful, I will be adding more features to it.
        </Paragraph>
        <Paragraph>
          There is a possibility that I can bring in paid elements as well for
          monetizing; but I don't know. Most of the features will be free
          anyways, so nothing to worry about. It will be for the exclusive
          features that will be available under premium if I were to do this.
        </Paragraph>
      </TextCanvas>

      <ButtonWrapper>
        <Button
          size="large"
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
