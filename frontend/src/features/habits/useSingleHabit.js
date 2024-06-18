import { useQuery } from "@tanstack/react-query";
import { getSingleHabit } from "../../api/apiHabits.js";
import { useParams } from "react-router-dom";

export default function useSingleHabit() {
  const { habitID } = useParams();

  const {
    data: habit,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getSingleHabit(habitID),
    queryKey: ["habit", habitID],
  });

  return { habit, isLoading, error };
}
