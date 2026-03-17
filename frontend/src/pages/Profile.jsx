import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiEdit3 } from "react-icons/fi";
import { HiOutlineChartBar } from "react-icons/hi";
import { IoSparkles } from "react-icons/io5";
import { PiTrophyFill } from "react-icons/pi";
import ProfileEditForm from "../features/authentication/ProfileEditForm.jsx";
import DeleteAccountSection from "../features/authentication/DeleteAccountSection.jsx";
import useUser from "../features/authentication/useUser.js";
import useGetUserHabitCount from "../features/users/useGetUserHabitCount.js";
import useGetUserHabits from "../features/users/useGetUserHabits.js";
import UserProfileOverview from "../features/users/UserProfileOverview.jsx";
import Button from "../ui/Button.jsx";
import Spinner from "../ui/Spinner.jsx";
import PageLevelNotificationToast from "../ui/PageLevelNotificationToast.jsx";
import apiErrorFormat from "../api/apiErrorFormat.js";

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

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoading: isUserLoading, error: userError } = useUser();
  const userID = user?.userID;
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
      <PageLevelNotificationToast type="error">
        {apiErrorFormat(userError)}
      </PageLevelNotificationToast>
    );
  }

  if (!user) return null;

  if (isEditing) {
    return (
      <PageStack>
        <ProfileEditForm onCancel={() => setIsEditing(false)} />
        <DeleteAccountSection />
      </PageStack>
    );
  }

  const profileStrongThreshold =
    userHabitsData?.profileStrongThreshold ||
    habitCountData?.profileStrongThreshold ||
    30;
  const allHabits = userHabitsData?.habits || userHabitsData?.userHabits || [];
  const visibleHabits = allHabits.filter((habit) => !habit.isArchived);
  const spotlightHabits = sortHabitsForSpotlight(
    visibleHabits.length ? visibleHabits : allHabits,
  ).slice(0, 3);

  const stats = [
    {
      label: "Tracking",
      value: habitCountError ? "--" : habitCountData?.count || 0,
      caption: habitCountError
        ? "Your total habit count could not be loaded just now."
        : "The number of habits currently attached to your account.",
      icon: <HiOutlineChartBar />,
      tone: "brand",
    },
    {
      label: "Serious About",
      value: habitCountError ? "--" : habitCountData?.seriousAboutCount || 0,
      caption: habitCountError
        ? "Your momentum snapshot is temporarily unavailable."
        : `Habits with at least ${profileStrongThreshold} points of momentum.`,
      icon: <IoSparkles />,
      tone: "warning",
    },
    {
      label: "Mastered",
      value: habitCountError ? "--" : habitCountData?.achievedCount || 0,
      caption: habitCountError
        ? "Completed-habit totals are temporarily unavailable."
        : "Habits you have already pushed all the way to completion.",
      icon: <PiTrophyFill />,
      tone: "success",
    },
  ];

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
        headerLabel="Your profile"
        metaItems={user.email ? [user.email] : []}
        description="This is your home base for account details, habit momentum, and the public-facing profile other users can view."
        stats={stats}
        actions={
          <>
            <ActionButton type="button" onClick={() => setIsEditing(true)}>
              <FiEdit3 />
              <span>Edit profile</span>
            </ActionButton>

            {userID ? (
              <ActionButton as={Link} to={`/users/${userID}`} $variation="secondary">
                View public profile
              </ActionButton>
            ) : null}
          </>
        }
        habitsTitle="Habit spotlight"
        habitsIntro="A quick look at the habits that best represent your current rhythm."
        habits={userHabitsError ? [] : spotlightHabits}
        emptyHabitsText={
          userHabitsError
            ? "Your habit spotlight could not be loaded right now."
            : "Once you start tracking habits, your strongest ones will show up here."
        }
      />
    </PageStack>
  );
}

