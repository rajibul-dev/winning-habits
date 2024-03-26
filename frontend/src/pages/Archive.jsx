import styled from "styled-components";
import Heading from "../ui/Heading.jsx";
import HabitList from "../features/habits/HabitList.jsx";

export default function Archive() {
  return (
    <>
      <Heading>Archived habits</Heading>
      <HabitList show="archived" />
    </>
  );
}
