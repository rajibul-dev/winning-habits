import { useQuery } from "@tanstack/react-query";
import { getMyAchievements as apiGetMyAchievements } from "../../api/apiAchievements.js";

export default function useMyAchievements() {
  const {
    data: myAchievements,
    isLoading,
    error,
  } = useQuery({
    queryFn: apiGetMyAchievements,
    queryKey: ["my-achievements"],
  });

  return { myAchievements: myAchievements?.achievements, isLoading, error };
}
