import { useEffect, useState } from "react";
import useGetAllUsers from "../features/users/useGetAllUsers.js";
import Heading from "../ui/Heading.jsx";
import Info from "../ui/Info.jsx";

export default function Users() {
  const { data, error, isLoading } = useGetAllUsers();
  const [fancyText, setFancyText] = useState("");

  useEffect(() => {
    if (!error && !isLoading) {
      setFancyText(
        <>
          For now, just know that{" "}
          <strong style={{ fontWeight: 600 }}>{data.count} users</strong> are
          using this app in total.
        </>,
      );
    }
  }, [data, error, isLoading]);

  return (
    <>
      <Heading>Other users</Heading>
      <Info>This feature will come later. {fancyText}</Info>
    </>
  );
}
