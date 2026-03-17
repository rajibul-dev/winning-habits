import apiClient, { endpointV1 } from "./axiosConfig.js";

export async function createHabit(habit) {
  const res = await apiClient.post(`${endpointV1}/habits`, habit);
  return res.data;
}

export async function getUserHabits() {
  const res = await apiClient.get(`${endpointV1}/habits`);
  return res.data;
}

export async function getAllHabits() {
  const res = await apiClient.get(`${endpointV1}/habits/getAllHabits`);
  return res.data;
}

export async function getSingleHabit(id) {
  const res = await apiClient.get(`${endpointV1}/habits/${id}`);
  return res.data;
}

export async function updateSingleHabit({ id, name }) {
  const res = await apiClient.patch(`${endpointV1}/habits/${id}`, {
    name,
  });
  return res.data;
}

export async function deleteHabit(id) {
  const res = await apiClient.delete(`${endpointV1}/habits/${id}`);
  return res.data;
}

export async function addDailyAction({ habitID, answer }) {
  const res = await apiClient.post(`${endpointV1}/habits/${habitID}/action`, {
    answer,
  });
  return res.data;
}

export async function updateCustomDateAction({
  habitID,
  targetRecordID,
  updatedAnswer,
}) {
  const res = await apiClient.patch(`${endpointV1}/habits/${habitID}/action`, {
    targetRecordID,
    updatedAnswer,
  });
  return res.data;
}

export async function upsertDailyRecordNote({ habitID, targetRecordID, note }) {
  const res = await apiClient.patch(`${endpointV1}/habits/${habitID}/note`, {
    targetRecordID,
    note,
  });
  return res.data;
}

export async function resetHabitProgress(id) {
  const res = await apiClient.put(`${endpointV1}/habits/${id}/reset`);
  return res.data;
}

export async function handleArchive({ id, isArchive }) {
  const res = await apiClient.post(`${endpointV1}/habits/${id}/archive`, {
    isArchive,
  });
  return res.data;
}

export async function runHabitSchemaManager() {
  const res = await apiClient.post(
    `${endpointV1}/habits/habitSchemaManager`,
    {},
    {
      headers: {
        "x-api-key": import.meta.env.VITE_SCHEMA_MANAGER_KEY,
      },
    },
  );

  return res.data;
}
