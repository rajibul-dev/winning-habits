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

  const users = [...(data?.users || [])].sort((userA, userB) => {
    const isCurrentUserA = userA._id === currentUser?.userID;
    const isCurrentUserB = userB._id === currentUser?.userID;

    if (isCurrentUserA !== isCurrentUserB) {
      return isCurrentUserA ? -1 : 1;
    }

    return userA.name.localeCompare(userB.name);
  });

  if (!users.length) return <Empty resourceName="users" />;

  return (
    <StyledList>
      {users.map((user) => {
        const isCurrentUser = user._id === currentUser?.userID;

        return (
          <UserListItem
            key={user._id}
            user={user}
            badge={isCurrentUser ? "You" : null}
            secondaryText={
              isCurrentUser
                ? "Nuanced supporting profile text perhaps."
                : "Add a supporting profile text here."
            }
          />
        );
      })}
    </StyledList>
  );
}
