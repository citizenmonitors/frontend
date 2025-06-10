import { useRouter } from "next/navigation";
import { useAppDispatch } from "./redux";
import { showAlert } from "../redux/features/alertSlice";
import { useLayoutEffect } from "react";

function useProtectRoute(condition: any, redirectPath: string, message?: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    if (!condition) {
      router.push(
        redirectPath
      );

      if (message) {
        dispatch(showAlert({ message, type: "error" }))
      }
    }
  }, [])

}

export default useProtectRoute;