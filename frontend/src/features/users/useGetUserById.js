import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../api/apiUsers.js";

export default function useGetUserById(userID) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userById", userID],
    queryFn: () => getUserById(userID),
    enabled: Boolean(userID),
  });

  return {
    user: data?.user,
    isLoading,
    error,
  };
}
