import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { upsertDailyRecordNote as apiUpsertDailyRecordNote } from "../../api/apiHabits.js";

export default function useUpsertDailyRecordNote() {
  const queryClient = useQueryClient();

  const { mutate: saveDailyRecordNote, isPending: isSavingNote } = useMutation({
    mutationFn: ({ habitID, targetRecordID, note }) =>
      apiUpsertDailyRecordNote({ habitID, targetRecordID, note }),
    onError: (err) => toast.error(err.response?.data?.msg || "Could not save note"),
    onSuccess: (data, { habitID, note }) => {
      queryClient.invalidateQueries({
        queryKey: ["my-habits"],
      });
      queryClient.invalidateQueries({
        queryKey: ["habit", habitID],
      });
      toast.success(note?.trim() ? "Note saved" : "Note removed");
    },
  });

  return { saveDailyRecordNote, isSavingNote };
}
