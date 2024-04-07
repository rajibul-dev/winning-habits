import { useQuery } from "@tanstack/react-query";
import { getOtherUserAchievements as apiGetOtherUserAchievements } from "../../api/apiAchievements.js";
import { useSearchParams } from "react-router-dom";

export default function useOtherUserAchievements() {
  // TODO: route not yet created
  const { userID } = useSearchParams();

  const {
    data: otherUserAchievements,
    isLoading,
    error,
  } = useQuery({
    queryFn: (id) => apiGetOtherUserAchievements(id),
    queryKey: ["user-achievements", userID],
  });

  return { otherUserAchievements, isLoading, error };
}
