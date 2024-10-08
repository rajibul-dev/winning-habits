import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../utils/firebase.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/axiosConfig.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { toggleMainGuide } from "../app-guide/guideSlice.js";
import { useDispatch } from "react-redux";

async function handleGoogleLogin() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const resultsFromGoogle = await signInWithPopup(auth, provider);

  const highResAvatar = resultsFromGoogle.user.photoURL.replace(
    "s96-c",
    "s512-c",
  );

  const res = await apiClient.post("/api/v1/auth/google", {
    name: resultsFromGoogle.user.displayName,
    email: resultsFromGoogle.user.email,
    avatar: highResAvatar,
  });
  return res.data;
}

export default function useOAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    mutate: googleLogin,
    isPending: isGoogleLoggingIn,
    error: googleError,
    isError: isGoogleError,
  } = useMutation({
    mutationFn: handleGoogleLogin,
    onSuccess: async (data) => {
      queryClient.setQueryData(["user"], data.user);
      navigate("/app", { replace: true });
      toast.success(`Logged in successfully! Welcome ${data.user.name}!`);

      if (!localStorage.getItem("firstLogin")) {
        localStorage.setItem("firstLogin", true);
        dispatch(toggleMainGuide());
      }
    },
    onError: (error) => {
      toast.error(error.response.data.msg);
    },
  });

  return { googleLogin, isGoogleLoggingIn, googleError, isGoogleError };
}
