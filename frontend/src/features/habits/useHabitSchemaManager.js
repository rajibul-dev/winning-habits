import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runHabitSchemaManager } from "../../api/apiHabits";

export default function useHabitSchemaManager() {
  const queryClient = useQueryClient();

  const { mutate: runSchemaManager, isPending } = useMutation({
    mutationFn: runHabitSchemaManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit"] });
    },
  });

  return { runSchemaManager, isPending };
}
