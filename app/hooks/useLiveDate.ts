import { useEffect, useState } from "react";

export default function useLiveDate(updateFrequency?: number) {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, updateFrequency || 1000);
    return () => clearInterval(interval);
  }, []);

  return date;
}