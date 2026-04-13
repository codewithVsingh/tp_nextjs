import { useEffect } from "react";
import { initScrollTracking } from "@/lib/analytics";

const ScrollTracker = () => {
  useEffect(() => {
    const cleanup = initScrollTracking();
    return cleanup;
  }, []);
  return null;
};

export default ScrollTracker;
