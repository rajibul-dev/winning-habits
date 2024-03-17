import { useQuery } from "@tanstack/react-query";
import { getSingleHabit } from "../../api/apiHabits.js";

export default function useSingleHabit() {
  const {
    data: habit,
    isLoading,
    error,
  } = useQuery({
    queryFn: getSingleHabit,
    queryKey: ["single-habit"],
  });
  return { habit, isLoading, error };
}
