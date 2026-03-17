import { getUserHabitCount } from "../../api/apiUsers";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserHabitCount(userID) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userHabitCount", userID],
    queryFn: () => getUserHabitCount(userID),
    enabled: Boolean(userID),
  });

  return { data, isLoading, error };
}
