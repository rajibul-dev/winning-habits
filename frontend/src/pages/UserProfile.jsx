import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineChartBar } from "react-icons/hi";
import { IoSparkles } from "react-icons/io5";
import { PiTrophyFill } from "react-icons/pi";
import apiErrorFormat from "../api/apiErrorFormat.js";
import useUser from "../features/authentication/useUser.js";
import UserProfileOverview from "../features/users/UserProfileOverview.jsx";
import useGetUserById from "../features/users/useGetUserById.js";
import useGetUserHabitCount from "../features/users/useGetUserHabitCount.js";
import useGetUserHabits from "../features/users/useGetUserHabits.js";
import Button from "../ui/Button.jsx";
import PageLevelNotificationToast from "../ui/PageLevelNotificationToast.jsx";
import Spinner from "../ui/Spinner.jsx";

const PageStack = styled.div`
  display: grid;
  gap: 2.4rem;
`;

const ActionButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

function sortHabitsForSpotlight(habits = []) {
  return [...habits].sort((habitA, habitB) => {
    const pointsDiff = (habitB.totalPoints || 0) - (habitA.totalPoints || 0);
    if (pointsDiff !== 0) return pointsDiff;

    const streakDiff = (habitB.streak || 0) - (habitA.streak || 0);
    if (streakDiff !== 0) return streakDiff;

    return habitA.name.localeCompare(habitB.name);
  });
}

export default function UserProfile() {
  const { userID } = useParams();
  const { user, isLoading: isUserLoading, error: userError } = useGetUserById(userID);
  const { user: currentUser } = useUser();
  const isCurrentUser = user?._id === currentUser?.userID;
  const {
    data: habitCountData,
    isLoading: isHabitCountLoading,
    error: habitCountError,
  } = useGetUserHabitCount(userID);
  const {
    data: userHabitsData,
    isLoading: areUserHabitsLoading,
    error: userHabitsError,
  } = useGetUserHabits(userID);

  if (isUserLoading || (userID && (isHabitCountLoading || areUserHabitsLoading))) {
    return <Spinner />;
  }

  if (userError) {
    return (
      <PageStack>
        <PageLevelNotificationToast type="error">
          {apiErrorFormat(userError)}
        </PageLevelNotificationToast>
        <ActionButton as={Link} to="/users" $variation="secondary">
          Back to users
        </ActionButton>
      </PageStack>
    );
  }

  if (!user) return null;

  const allHabits = userHabitsData?.userHabits || [];
  const visibleHabits = allHabits.filter((habit) => !habit.isArchived);
  const spotlightHabits = sortHabitsForSpotlight(
    visibleHabits.length ? visibleHabits : allHabits,
  ).slice(0, 3);

  const stats = [
    {
      label: "Tracking",
      value: habitCountError ? "--" : habitCountData?.count || 0,
      caption: habitCountError
        ? "This user's total habit count is unavailable right now."
        : "The number of habits currently tied to this profile.",
      icon: <HiOutlineChartBar />,
      tone: "brand",
    },
    {
      label: "Serious About",
      value: habitCountError ? "--" : habitCountData?.seriousAboutCount || 0,
      caption: habitCountError
        ? "Momentum stats are unavailable right now."
        : "Habits where consistency is starting to look serious.",
      icon: <IoSparkles />,
      tone: "warning",
    },
    {
      label: "Mastered",
      value: habitCountError ? "--" : habitCountData?.achievedCount || 0,
      caption: habitCountError
        ? "Completed-habit totals are unavailable right now."
        : "Habits already pushed across the finish line.",
      icon: <PiTrophyFill />,
      tone: "success",
    },
  ];

  const firstName = user.name?.trim().split(/\s+/)[0] || "This user";

  return (
    <PageStack>
      {habitCountError ? (
        <PageLevelNotificationToast type="error">
          {apiErrorFormat(habitCountError)}
        </PageLevelNotificationToast>
      ) : null}

      {userHabitsError ? (
        <PageLevelNotificationToast type="error">
          {apiErrorFormat(userHabitsError)}
        </PageLevelNotificationToast>
      ) : null}

      <UserProfileOverview
        user={user}
        headerLabel={isCurrentUser ? "Your public view" : "Community profile"}
        metaItems={isCurrentUser ? ["This is how other users see you"] : ["Winning Habits member"]}
        description={
          isCurrentUser
            ? "This is the public-facing version of your profile. As the backend grows, this page can highlight your best streaks and signature habits even more clearly."
            : `${firstName} is building consistency one habit at a time. More streak-focused highlights can land here once the backend exposes them.`
        }
        stats={stats}
        actions={
          isCurrentUser ? (
            <>
              <ActionButton as={Link} to="/profile">Edit your profile</ActionButton>
              <ActionButton as={Link} to="/users" $variation="secondary">
                Browse users
              </ActionButton>
            </>
          ) : (
            <ActionButton as={Link} to="/users" $variation="secondary">
              Back to users
            </ActionButton>
          )
        }
        habitsTitle={isCurrentUser ? "What people can notice" : "Habit spotlight"}
        habitsIntro={
          isCurrentUser
            ? "These are the habits currently making the strongest impression on your public profile."
            : "A quick look at the habits shaping their momentum right now."
        }
        habits={userHabitsError ? [] : spotlightHabits}
        emptyHabitsText={
          userHabitsError
            ? "This habit spotlight could not be loaded right now."
            : `${firstName} has not shared habit activity here yet.`
        }
      />
    </PageStack>
  );
}
