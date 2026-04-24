import { useEffect } from "react";
import { initScrollTracking } from "@/modules/shared/logic/eventTrackingEngine";

const ScrollTracker = () => {
  useEffect(() => {
    const cleanup = initScrollTracking();
    return cleanup;
  }, []);
  return null;
};

export default ScrollTracker;


