export function createHabit(req, res) {
  res.send("Created a habit!");
}

export function getAllHabits(req, res) {
  res.send("All habits! (admin only)");
}

export function getUserHabits(req, res) {
  res.send("All user habits!");
}

export function getSingleHabit(req, res) {
  res.send("Single habit!");
}

export function updateSingleHabit(req, res) {
  res.send("Updated single habit!");
}

export function deleteHabit(req, res) {
  res.send("A habit deleted!");
}

export function addDailyAction(req, res) {
  res.send("You pressed yes or no!");
}

export function updateDailyAction(req, res) {
  res.send("You undid your yes or no! / You changed it to no!");
}

export function resetHabitProgress(req, res) {
  res.send("You reset your progress for a habit!");
}
