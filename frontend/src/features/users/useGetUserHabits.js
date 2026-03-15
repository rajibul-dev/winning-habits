import { getUserHabits } from "../../api/apiUsers";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserHabits(userID) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userHabits", userID],
    queryFn: () => getUserHabits(userID),
  });

  return { data, isLoading, error };
}
