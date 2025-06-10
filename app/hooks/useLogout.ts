import { useRouter } from "next/navigation";
import { clearElectionState } from "../redux/features/electionSlice";
import { clearSignupState } from "../redux/features/signupSlice";
import { logoutUser } from "../redux/features/userSlice";
import { useAppDispatch } from "./redux";

export default function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return () => {
    dispatch(clearSignupState());
    dispatch(clearElectionState());
    dispatch(logoutUser());
    router.replace("/auth/login");
  };
}
