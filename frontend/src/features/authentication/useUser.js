import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/apiAuth";

export default function useUser() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user) && !isLoading,
    error,
  };
}
