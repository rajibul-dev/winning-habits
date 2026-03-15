import useUserCount from "../features/users/useUserCount.js";
import Heading from "../ui/Heading.jsx";
import AllUsersList from "../features/users/AllUsersList.jsx";

export default function Users() {
  const { data, error, isLoading } = useUserCount();

  return (
    <>
      <Heading>
        All users {!error && !isLoading && (<>({data?.count})</> || "")}
      </Heading>
      <AllUsersList />
    </>
  );
}
