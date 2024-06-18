import { Link, useNavigate } from "react-router-dom";
import Empty from "../../ui/Empty.jsx";
import Heading from "../../ui/Heading.jsx";
import Spinner from "../../ui/Spinner.jsx";
import useSingleHabit from "./useSingleHabit.js";
import styled from "styled-components";
import Button from "../../ui/Button.jsx";
import { IoArrowBack } from "react-icons/io5";

const GoBackLink = styled(Link)``;
const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: 1rem;

  & svg {
    display: inline-block;
    width: 3.4rem;
    height: 3.4rem;
    cursor: pointer;
    &:hover {
      background-color: var(--color-grey-200);
    }
  }
`;

export default function SingleHabitFeature() {
  const { data, isLoading, error } = useSingleHabit();
  const navigate = useNavigate();

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
      <StyledHeading>
        <IoArrowBack onClick={() => navigate(-1)} />
        {name}
      </StyledHeading>
    </>
  );
}
