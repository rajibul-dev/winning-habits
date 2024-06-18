import { Link } from "react-router-dom";
import Empty from "../../ui/Empty.jsx";
import Heading from "../../ui/Heading.jsx";
import Spinner from "../../ui/Spinner.jsx";
import useSingleHabit from "./useSingleHabit.js";
import styled from "styled-components";
import Button from "../../ui/Button.jsx";

const GoBackLink = styled(Link)``;

export default function SingleHabitFeature() {
  const { data, isLoading, error } = useSingleHabit();

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <>
        <Empty resourceName="Habit" />
        <GoBackLink to={-1}>
          <Button>Go back to habits page</Button>
        </GoBackLink>
      </>
    );

  const { name } = data.habit;

  return (
    <>
      <Heading>{name}</Heading>
    </>
  );
}
