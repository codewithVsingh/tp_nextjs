import Link from "next/link";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";

/**
 * Slim conversion strip rendered directly above the footer.
 * Reuses existing variants — no new design tokens.
 */
const FooterCTAStrip = () => {
  return (
    <section
      aria-label="Find a tutor in Delhi"
      className="bg-accent border-t border-border"
    >
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2">
              Find the Right Tutor in Delhi Today
            </h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <li>✔ Free Demo Class</li>
              <li>✔ Verified Tutors</li>
              <li>✔ Instant Matching</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button variant="cta" size="lg" asChild>
              <Link href="/demo-booking">Start Free Demo</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                openWhatsApp(
                  "Hi, I'd like to talk to an expert counsellor about finding a tutor.",
                )
              }
            >
              Talk to Expert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTAStrip;
