import { useEffect, useState } from "react";

export default function useLiveGreeting() {
  const [greeting, setGreeting] = useState<string>("");

  const getGreeting = () => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 0 && hours < 12) {
      return "Good morning";
    } else if (hours >= 12 && hours < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

  useEffect(() => {
    setGreeting(getGreeting());
    setInterval(() => {
      setGreeting(getGreeting());
    }, 1000 * 60);
  }, []);

  return greeting;
}