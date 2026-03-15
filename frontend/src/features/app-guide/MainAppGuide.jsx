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
        <ModifiedH2 as="h1">Quick Guide</ModifiedH2>
        <Paragraph>
          This app is here to help you build habits around the good things you
          want to improve.
        </Paragraph>
        <Paragraph>
          <strong>Create a habit.</strong> Start by adding a habit you want to
          improve. Each day, you'll get a prompt asking whether you completed
          your task, with "yes" and "no" buttons.
        </Paragraph>
        <Paragraph>
          <strong>When you press "Yes".</strong> Your streak goes up, and you
          earn points at the same time.
        </Paragraph>
        <Paragraph>
          <strong>Points system.</strong> The app adds your current streak
          number to your existing points. So the longer your streak, the more
          points you gain.
        </Paragraph>
        <Paragraph>
          <strong>Example.</strong> If today is your first "yes," you get 1
          point. If you press "yes" again tomorrow, your streak becomes 2, so
          those 2 points get added to your existing 1 point, giving you 3 in
          total.
        </Paragraph>
        <Paragraph>
          <strong>When you press "No".</strong> That's part of the process too.
          A "no" is still useful information, and being honest will help you
          build real habits.
        </Paragraph>
        <Paragraph>
          Don't worry if you see a jump in points. That's just the app
          accurately tracking your progress.
        </Paragraph>

        <ModifiedH2 as="h2">Tracking progress</ModifiedH2>
        <Paragraph>
          <strong>Use the calendar.</strong> You don't need to visit the app
          every day to update your progress on time.
        </Paragraph>
        <Paragraph>
          You can set your "yeses" and "nos" from the calendar for any valid
          day, and the app will update and calculate the exact points you
          deserve.
        </Paragraph>
        <Paragraph>
          <strong>Goal.</strong> The goal is to reach 1,000 points. By then, the
          app will assume you've mastered the habit, so you won't need to track
          it actively anymore unless you still want to.
        </Paragraph>
        <Paragraph>At that point, it should feel like second nature.</Paragraph>

        <ModifiedH2 as="h2">Some tips</ModifiedH2>
        <Paragraph>
          <strong>Count necessary break days as a "yes".</strong> For example,
          working out every day isn't recommended. In many cases, 2 to 3 rest
          days a week are better.
        </Paragraph>
        <Paragraph>
          You'll know which days are break days for your habit, so count those
          as "yes."
        </Paragraph>
        <Paragraph>
          <strong>Be honest with your answers.</strong> You might think, "Why be
          honest when I can just say 'yes' to keep the streak and points?" I get
          it.
        </Paragraph>
        <Paragraph>
          In the future, the app might include an "add note" feature, so you can
          add notes about what went wrong or why you didn't do the task.
        </Paragraph>
        <Paragraph>
          That way, even "no" answers can be meaningful. Plus, fake points won't
          help you build real habits.
        </Paragraph>
        <Paragraph>
          <strong>
            Use the calendar day picker to track your habit progress.
          </strong>{" "}
          Visiting the app every day just to press "yes" or "no" might feel
          monotonous.
        </Paragraph>
        <Paragraph>
          You can use any tool, like a notebook or your memory, to track your
          habits first and update them in the app when you're ready.
        </Paragraph>
        <Paragraph>
          <strong>Add the app to your homescreen.</strong> Even though this is a
          web app, you can still add it to your home screen.
        </Paragraph>
        <Paragraph>
          You don't need to visit the app daily, but having it on your home
          screen can remind you without the mental burden of remembering to
          check it.
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
