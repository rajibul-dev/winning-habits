import styled from "styled-components";
import useMyAchievements from "./useMyAchievements.js";
import Spinner from "../../ui/Spinner.jsx";
import Empty from "../../ui/Empty.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import apiErrorFormat from "../../api/apiErrorFormat.js";
import { goldFlexText } from "../../styles/GlobalStyles.js";
import { FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BetterDesignSoon from "../../ui/BetterDesignSoon.jsx";

const StyledList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  gap: 3rem;
`;

const StyledItem = styled.li`
  font-size: var(--font-size-2xl);
  display: inline-block;
  background-image: var(--achievement-gold-bar);
  border: 1px solid var(--achievement-gold-color--shine-2);
  padding: 3rem;
  ${goldFlexText}

  display: flex;
  gap: 1rem;
  align-items: center;

  cursor: pointer;

  & svg {
    font-size: 3.4rem;
    filter: drop-shadow(0 1px 2px var(--achievement-gold-color--shadow));
  }
`;

// const dummy = [
//   {
//     habit: {
//       name: "Example",
//     },
//   },
//   {
//     habit: {
//       name: "Example",
//     },
//   },
//   {
//     habit: {
//       name: "Example",
//     },
//   },
//   {
//     habit: {
//       name: "Example",
//     },
//   },
// ];

export default function MyAchievements() {
  const { myAchievements, isLoading, error } = useMyAchievements();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  if (error)
    return (
      <PageLevelNotificationToast type="error">
        {apiErrorFormat(error)}
      </PageLevelNotificationToast>
    );

  if (myAchievements?.length === 0)
    return <Empty resourceName={"achievements"} />;

  return (
    <>
      <BetterDesignSoon />
      <StyledList>
        {myAchievements.map((item) => (
          <StyledItem
            key={item._id}
            onClick={() => navigate(`/app/habits/${item.habit._id}`)}
          >
            <FaTrophy />
            <span>{item.habit.name}</span>
          </StyledItem>
        ))}
      </StyledList>
    </>
  );
}
