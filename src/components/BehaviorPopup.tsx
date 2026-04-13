import { useState, useEffect, useCallback } from "react";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { trackEvent } from "@/lib/analytics";

const POPUP_DELAY_MS = 30_000;
const DISMISSED_KEY = "tp_popup_dismissed";

const BehaviorPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const wasDismissed = useCallback(() => {
    try {
      const ts = sessionStorage.getItem(DISMISSED_KEY);
      return ts ? Date.now() - Number(ts) < 600_000 : false; // 10 min cooldown
    } catch { return false; }
  }, []);

  const trigger = useCallback((source: string) => {
    if (triggered || wasDismissed()) return;
    setTriggered(true);
    setShowModal(true);
    trackEvent("popup_triggered", { trigger: source, page: window.location.pathname });
  }, [triggered, wasDismissed]);

  // Time-based trigger (30 seconds)
  useEffect(() => {
    const timer = setTimeout(() => trigger("time_delay"), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [trigger]);

  // Exit intent trigger (desktop only — mouse leaves viewport top)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 5) trigger("exit_intent");
    };
    document.addEventListener("mouseout", handler);
    return () => document.removeEventListener("mouseout", handler);
  }, [trigger]);

  const handleClose = (open: boolean) => {
    setShowModal(open);
    if (!open) {
      try { sessionStorage.setItem(DISMISSED_KEY, String(Date.now())); } catch {}
    }
  };

  return <LeadCaptureModal open={showModal} onOpenChange={handleClose} source="behavior_popup" />;
};

export default BehaviorPopup;
