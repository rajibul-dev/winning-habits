export default function streakColor(streak) {
  let color = "var(--color-lime-500)";

  if (streak >= 0 && streak <= 6) {
    color = "var(--color-lime-500)";
  } else if (streak >= 7 && streak <= 20) {
    color = "var(--color-yellow-400)";
  } else if (streak >= 21) {
    color = "var(--color-orange-500)";
  }

  return color;
}
