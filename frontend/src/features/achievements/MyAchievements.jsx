import styled from "styled-components";
import useMyAchievements from "./useMyAchievements.js";
import Spinner from "../../ui/Spinner.jsx";
import Empty from "../../ui/Empty.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import apiErrorFormat from "../../api/apiErrorFormat.js";

const StyledList = styled.ul``;

export default function MyAchievements() {
  const { myAchievements, isLoading, error } = useMyAchievements();

  if (isLoading) return <Spinner />;

  if (error)
    return (
      <PageLevelNotificationToast type="error">
        {apiErrorFormat(error)}
      </PageLevelNotificationToast>
    );

  if (myAchievements?.count === 0)
    return <Empty resourceName={"achievements"} />;

  return <StyledList></StyledList>;
}
