import { useLocation } from "react-router-dom";

export default function useURL() {
  return new URLSearchParams(useLocation().search);
}
