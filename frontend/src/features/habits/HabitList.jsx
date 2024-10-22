import styled from "styled-components";
import useHabits from "./useUserHabits.js";
import Empty from "../../ui/Empty.jsx";
import Spinner from "../../ui/Spinner.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import HabitListItem from "./HabitListItem.jsx";
import apiErrorFormat from "../../api/apiErrorFormat.js";
import { pixelToEm } from "../../styles/GlobalStyles.js";

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  padding-bottom: 9rem;
  @media (max-width: ${pixelToEm(700)}) {
    padding-bottom: 7rem;
  }
`;

export default function HabitList({ show = "non-archived" }) {
  const { data, isFetchingUserHabits, error } = useHabits();
  const nonArchiveHabits = data?.userHabits.filter(
    (habit) => !habit.isArchived,
  );
  const archiveHabits = data?.userHabits.filter((habit) => habit.isArchived);
  const allHabits = data?.userHabits;

  let habitsToRender = null;

  switch (show) {
    case "non-archived":
      habitsToRender = nonArchiveHabits;
      break;
    case "archived":
      habitsToRender = archiveHabits;
      break;
    case "all":
      habitsToRender = allHabits;
      break;

    default:
      habitsToRender = nonArchiveHabits;
      break;
  }

  if (isFetchingUserHabits) return <Spinner />;

  if (error)
    return (
      <PageLevelNotificationToast type="error">
        {apiErrorFormat(error)}
      </PageLevelNotificationToast>
    );

  if (!data?.count || (habitsToRender.length === 0 && show !== "archived"))
    return <Empty resourceName={"habits"} />;
  else if (!data?.count || (habitsToRender.length === 0 && show === "archived"))
    return <p>You don't have any archived habits</p>;

  return (
    <StyledList>
      {habitsToRender.map((habit) => (
        <HabitListItem key={habit._id} habit={habit} />
      ))}
    </StyledList>
  );
}
