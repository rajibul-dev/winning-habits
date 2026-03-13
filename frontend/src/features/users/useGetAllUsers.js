import { useQuery } from "@tanstack/react-query";
import { getUserCount } from "../../api/apiUsers.js";

export default function useGetAllUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userCount"],
    queryFn: getUserCount,
  });

  return { data, isLoading, error };
}
