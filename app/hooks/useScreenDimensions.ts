import { useEffect, useState } from "react";

type ScreenDimensions = {
  width?: number;
}

export default function useScreenDimensions() {
  const [screenDimensions, setScreenDimensions] = useState<ScreenDimensions>({
    width: 0,
  });

  useEffect(() => {
    function handleResize() {
      setScreenDimensions(prev => ({
        ...prev,
        width: window.innerWidth
      }))
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  return screenDimensions;
}