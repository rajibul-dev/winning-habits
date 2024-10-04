import useViewportLessThan from "./useViewportLessThan";

export default function useIsMobile() {
  const { isLessthanWidth } = useViewportLessThan(500);
  return isLessthanWidth;
}
