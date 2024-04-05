export default function apiErrorFormat(error) {
  return error.response.data.msg;
}
