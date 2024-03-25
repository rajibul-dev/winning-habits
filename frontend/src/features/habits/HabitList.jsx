import styled from "styled-components";
import useHabits from "./useUserHabits.js";
import Empty from "../../ui/Empty.jsx";
import Spinner from "../../ui/Spinner.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import HabitListItem from "./HabitListItem.jsx";

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default function HabitList({ show = "non-archived" }) {
  const { data, isFetchingUserHabits, error } = useHabits();
  const nonArchiveHabits = data?.userHabits.filter(
    (habit) => !habit.isArchived,
  );
  const archiveHabits = data?.userHabits.filter((habit) => !habit.isArchived);
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
        {error.response.data.msg}
      </PageLevelNotificationToast>
    );
  if (!data?.count) return <Empty resourceName={"habits"} />;

  return (
    <StyledList>
      {habitsToRender.map((habit) => (
        <HabitListItem key={habit._id} habit={habit} />
      ))}
    </StyledList>
  );
}
