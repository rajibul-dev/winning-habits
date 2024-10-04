import { useEffect, useState } from "react";

export default function useViewportLessThan(width) {
  const [isLessthanWidth, setIsLessThanWidth] = useState(
    window.innerWidth < width,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLessThanWidth(window.innerWidth < width);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return  isLessthanWidth ;
}
