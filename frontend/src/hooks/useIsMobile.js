import useViewportLessThan from "./useViewportLessThan";

export default function useIsMobile() {
  const isLessthanWidth = useViewportLessThan(700);
  return isLessthanWidth;
}
