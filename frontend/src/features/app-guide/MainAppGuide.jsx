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

  @media (min-width: ${pixelToEm(500)}) {
    padding-right: 2rem;
  }

  & strong {
    font-weight: 600;
  }

  @media (max-width: ${pixelToEm(500)}) {
    font-size: 1.8rem;
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
          The app's purpose is to help you build habits around the good things
          you want to improve. Start by creating a new habit; each day, you'll
          get a prompt asking whether you completed your task, with 'yes' and
          'no' buttons. 'Yes' will add points and update your streak! How many
          points? It adds your current streak number as points. 'No' will reset
          the streak to 0, but your total points remain the same.
        </Paragraph>
        <Paragraph>
          And don’t worry—this isn’t like Duolingo, where you need to visit the
          app every day to update it (the streak) on time. You can set your
          'yeses' and 'nos' from the calendar, and it will calculate the exact
          points you deserve.
        </Paragraph>
        <Paragraph>
          The goal is to reach 1,000 points. By then, the app will assume you've
          mastered the habit, so you won’t need to track it actively
          anymore—unless you still want to. At that point, it should feel like
          second nature.
        </Paragraph>

        <ModifiedH2 as="h2">Some tips</ModifiedH2>
        <Paragraph>
          <strong>Count necessary break days as a 'yes'.</strong> For example,
          working out every day isn't recommended, but 2 to 3 rest days a week
          are better. You’ll know which days are your break days for your
          habit—count them as 'yes'.
        </Paragraph>
        <Paragraph>
          <strong>Be honest with the answers.</strong> You might think, "Why be
          honest when I can just say 'yes' to keep the streak and points?" I get
          it. In the future, the app might include an 'add note' feature, so you
          can add notes about what went wrong or why you didn't do the task.
          This way, even 'no' answers can be meaningful. Plus, fake points won’t
          help you build real habits.
        </Paragraph>
        <Paragraph>
          <strong>
            Use the calendar day picker to track your habit progress.
          </strong>{" "}
          Visiting this app every day just to press 'yes' or 'no' might feel
          monotonous. You can use any tool—like a notebook or your memory—to
          track your habits, then update it in the app when you’re ready.
        </Paragraph>
        <Paragraph>
          <strong>Add the app to your homescreen.</strong> Although this is a
          web-based app, you can still add it to your home screen. Why? It’s up
          to you. While you don’t need to visit the app daily, having it on your
          home screen can remind you without the mental burden of remembering to
          check it.
        </Paragraph>
        <ModifiedH2 as="h2">A message from the developer</ModifiedH2>
        <Paragraph>
          If this app becomes popular and people find it useful, I’ll add more
          features. There’s a possibility I might introduce paid elements for
          monetization, but most of the features will remain free, so no
          worries! If I do add premium features, they’ll be for exclusive
          options.
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
