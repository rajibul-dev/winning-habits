import { useQuery } from "@tanstack/react-query";
import { getUserHabits } from "../../api/apiHabits.js";

export default function useHabits() {
  const {
    data,
    isLoading: isFetchingUserHabits,
    error,
  } = useQuery({
    queryKey: ["my-habits"],
    queryFn: getUserHabits,
  });

  return { data, isFetchingUserHabits, error };
}
