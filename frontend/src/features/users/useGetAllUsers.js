import { getAllUsers } from "../../api/apiUsers";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  return { data, isLoading, error };
}
