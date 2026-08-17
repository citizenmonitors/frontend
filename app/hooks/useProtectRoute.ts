import { useRouter } from "next/navigation";
import { useAppDispatch } from "./redux";
import { showAlert } from "../redux/features/alertSlice";
import { useLayoutEffect } from "react";

function useProtectRoute(
  condition: any,
  redirectPath: string,
  message?: string,
  enabled = true
) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    if (!enabled) return;
    if (!condition) {
      router.replace(redirectPath);

      if (message) {
        dispatch(showAlert({ message, type: "error" }));
      }
    }
  }, [condition, dispatch, enabled, message, redirectPath, router]);
}

export default useProtectRoute;
