import { useQuery } from "@tanstack/react-query";
import { getSingleHabit } from "../../api/apiHabits.js";
import { useSearchParams } from "react-router-dom";

export default function useSingleHabit() {
  const { id } = useSearchParams();

  const {
    data: habit,
    isLoading,
    error,
  } = useQuery({
    queryFn: getSingleHabit,
    queryKey: ["habit", id],
  });

  return { habit, isLoading, error };
}
