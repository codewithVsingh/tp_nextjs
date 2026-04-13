// Lightweight analytics tracking utility
// Logs events to console in dev, can be wired to GA4/Mixpanel/Posthog in production

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100];
const firedThresholds = new Set<number>();

export function trackEvent(name: string, data?: EventData) {
  // Production: replace with actual analytics call
  // e.g. gtag('event', name, data) or posthog.capture(name, data)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${name}`, data || "");
  }

  // Store locally for conversion tracking dashboard
  try {
    const events = JSON.parse(sessionStorage.getItem("tp_events") || "[]");
    events.push({ name, data, ts: Date.now() });
    sessionStorage.setItem("tp_events", JSON.stringify(events.slice(-100)));
  } catch { /* quota exceeded — ignore */ }
}

export function trackCTAClick(ctaName: string, page: string) {
  trackEvent("cta_click", { cta: ctaName, page, url: window.location.pathname });
}

export function initScrollTracking() {
  if (typeof window === "undefined") return;
  firedThresholds.clear();

  const handler = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.round((scrollTop / docHeight) * 100);

    for (const t of SCROLL_THRESHOLDS) {
      if (pct >= t && !firedThresholds.has(t)) {
        firedThresholds.add(t);
        trackEvent("scroll_depth", { depth: t, page: window.location.pathname });
      }
    }
  };

  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}
