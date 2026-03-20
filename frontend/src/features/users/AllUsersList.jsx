import styled from "styled-components";
import apiErrorFormat from "../../api/apiErrorFormat.js";
import useUser from "../authentication/useUser.js";
import Empty from "../../ui/Empty.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import Spinner from "../../ui/Spinner.jsx";
import UserListItem from "../../ui/UserListItem.jsx";
import useGetAllUsers from "./useGetAllUsers";

const StyledList = styled.ul`
  display: grid;
  gap: 1.4rem;
`;

export default function AllUsersList() {
  const { data, isLoading, error } = useGetAllUsers();
  const { user: currentUser } = useUser();

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <PageLevelNotificationToast type="error">
        {apiErrorFormat(error)}
      </PageLevelNotificationToast>
    );

  const users = data?.users || [];

  const sortedUsers = currentUser
    ? [
        ...users.filter((u) => u._id === currentUser.userID),
        ...users.filter((u) => u._id !== currentUser.userID),
      ]
    : users;

  if (!sortedUsers.length) return <Empty resourceName="users" />;

  return (
    <StyledList>
      {sortedUsers.map((user) => {
        const isCurrentUser = user._id === currentUser?.userID;

        return (
          <UserRow key={user._id} user={user} isCurrentUser={isCurrentUser} />
        );
      })}
    </StyledList>
  );
}

function UserRow({ user, isCurrentUser }) {
  const habitCount = user.habitCount || 0;

  const secondaryTextStatements = [
    `Tracking ${habitCount} ${habitCount === 1 ? "habit" : "habits"}`,
  ];
  if (user?.seriousAboutCount) {
    secondaryTextStatements.push(
      `Serious about ${user.seriousAboutCount} ${user.seriousAboutCount === 1 ? "habit" : "habits"}`,
    );
  }
  if (user?.achievedCount) {
    secondaryTextStatements.push(
      `Mastered ${user.achievedCount} ${user.achievedCount === 1 ? "habit" : "habits"}`,
    );
  }

  return (
    <UserListItem
      user={user}
      badge={isCurrentUser ? "You" : null}
      secondaryText={secondaryTextStatements.join(" || ")}
      to={`/users/${user._id}`}
    />
  );
}
