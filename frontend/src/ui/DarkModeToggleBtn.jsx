import { IoMoon, IoSunny } from "react-icons/io5";
import ButtonIcon from "./ButtonIcon.jsx";
import { useDarkMode } from "../context/DarkModeContext";

export default function DarkModeToggleBtn() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ButtonIcon onClick={toggleDarkMode}>
      {!isDarkMode ? <IoMoon /> : <IoSunny />}
    </ButtonIcon>
  );
}
