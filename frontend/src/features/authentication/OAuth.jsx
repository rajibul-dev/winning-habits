import { AiFillGoogleCircle } from "react-icons/ai";
import Button from "../../ui/Button.jsx";
import useOAuth from "./useOAuth.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";

export default function OAuth() {
  const { googleLogin, isGoogleLoggingIn } = useOAuth();

  async function handleOAuthClick(e) {
    e.preventDefault();
    googleLogin();
  }

  return (
    <Button
      size="medium"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: ".8rem",
      }}
      type="button"
      $variation="secondary"
      onClick={handleOAuthClick}
      disabled={isGoogleLoggingIn}
    >
      {!isGoogleLoggingIn ? (
        <>
          <AiFillGoogleCircle
            style={{
              fontSize: "2.4rem",
            }}
          />
          <span>Continue with Google</span>
        </>
      ) : (
        <SpinnerMini />
      )}
    </Button>
  );
}
