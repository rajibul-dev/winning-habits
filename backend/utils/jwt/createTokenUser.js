export default function (user) {
  return { name: user.name, userID: user._id, role: user.role };
}
