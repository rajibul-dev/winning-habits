import { useQuery } from "@tanstack/react-query";
import { getSingleHabit } from "../../api/apiHabits.js";
import { useParams } from "react-router-dom";

export default function useSingleHabit() {
  const { habitID } = useParams();

  const { data, isLoading, error } = useQuery({
    queryFn: () => getSingleHabit(habitID),
    queryKey: ["habit", habitID],
  });

  return { data, isLoading, error };
}
