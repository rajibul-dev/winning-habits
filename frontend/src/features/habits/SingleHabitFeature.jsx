import Heading from "../../ui/Heading.jsx";
import Spinner from "../../ui/Spinner.jsx";
import useSingleHabit from "./useSingleHabit.js";

export default function SingleHabitFeature() {
  const { data, isLoading, error } = useSingleHabit();

  if (isLoading) return <Spinner />;
  const { name } = data.habit;

  return (
    <>
      <Heading>{name}</Heading>
    </>
  );
}
