export function getNow() {
  if (process.env.NODE_ENV === "development" && global.devTimeOverride) {
    return new Date(global.devTimeOverride);
  }

  return new Date();
}
