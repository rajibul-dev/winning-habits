import { useEffect } from "react";

export default function useOnScrollHandler({ handler, condition }) {
  useEffect(() => {
    function handleScroll() {
      if (condition) {
        handler();
        document.removeEventListener("wheel", handleScroll);
      }
    }
    if (condition) document.addEventListener("wheel", handleScroll);

    return () => document.removeEventListener("wheel", handleScroll);
  }, [condition, handler]);
}
