import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/apiUsers.js";

export default function useUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return {
    user: data?.user,
    isLoading,
    isAuthenticated: Boolean(data?.user) && !isLoading,
    error,
  };
}
