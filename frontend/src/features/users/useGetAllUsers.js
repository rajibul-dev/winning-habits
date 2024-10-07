import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/apiUsers";

export default function useGetAllUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userCount"],
    queryFn: getAllUsers,
  });

  return { data, isLoading, error };
}
