import { useParams, useLocation, Link } from "react-router-dom";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, MapPin, ArrowRight, BookOpen, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  parseSlug,
  parseNewSlug,
  getIntro,
  getFaqs,
  subjects,
  areas,
  classes,
} from "@/data/seoData";

const TutorSeoPage = () => {
  const params = useParams();
  const location = useLocation();

  const pageData = useMemo(() => {
    // Build slug from URL path for new patterns
    const path = location.pathname.replace(/^\//, "");

    // Try new patterns from full path
    const newResult = parseNewSlug(path);
    if (newResult) return newResult;

    // Legacy /tutors/:slug
    if (params.slug) {
      return parseSlug(params.slug);
    }

    return null;
  }, [params, location.pathname]);

  if (!pageData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
            <Link to="/" className="text-primary underline">Go Home</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const idx = pageData.slug.length;
  const intro = getIntro(pageData.keyword, "Delhi", idx, pageData.area?.pincode);
  const faqs = getFaqs(pageData.keyword, pageData.area?.name, idx, pageData.classLevel?.label);

  // Related links
  const relatedSubjects = subjects
    .filter((s) => s.slug !== pageData.subject?.slug)
    .slice(0, 6);
  const relatedAreas = areas
    .filter((a) => a.slug !== pageData.area?.slug)
    .slice(0, 6);
  const relatedClasses = classes.filter(c => ["8", "9", "10", "11", "12"].includes(c.slug) && c.slug !== pageData.classLevel?.slug).slice(0, 5);

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tutors", href: "/tutors/math-delhi" },
  ];
  if (pageData.subject) {
    breadcrumbs.push({
      label: pageData.subject.name,
      href: `/tutors/${pageData.subject.slug}-delhi`,
    });
  }
  if (pageData.area && pageData.type !== "area") {
    breadcrumbs.push({
      label: pageData.area.name,
      href: `/tutors/${pageData.area.slug}-delhi`,
    });
  }

  // JSON-LD schemas
  const educationalOrgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Tutors Parliament",
    description: pageData.metaDescription,
    url: `https://tutorsparliament.com/${pageData.slug}`,
    areaServed: {
      "@type": "City",
      name: pageData.area?.name || "Delhi",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: pageData.area?.name || "Delhi",
      addressRegion: "Delhi",
      postalCode: pageData.area?.pincode || "110001",
      addressCountry: "IN",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f: { q: string; a: string }) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Tutors Parliament — ${pageData.area?.name || "Delhi"}`,
    description: pageData.metaDescription,
    url: `https://tutorsparliament.com/${pageData.slug}`,
    telephone: "+91-9873101564",
    address: {
      "@type": "PostalAddress",
      addressLocality: pageData.area?.name || "Delhi",
      addressRegion: "Delhi",
      postalCode: pageData.area?.pincode || "110001",
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "2500",
    },
  };

  const showClassSection = !!pageData.classLevel;
  const showPincode = !!pageData.area?.pincode;

  return (
    <>
      <SEOHead
        title={pageData.title}
        description={pageData.metaDescription}
        keywords={`${pageData.keyword}, home tutor Delhi, tuition classes Delhi, CBSE ICSE tutor${pageData.area ? `, tutor ${pageData.area.name}` : ""}${pageData.classLevel ? `, ${pageData.classLevel.label} tutor` : ""}`}
        canonical={`https://tutorsparliament.com/${pageData.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-24 pb-2">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((bc, i) => (
                <BreadcrumbItem key={i}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbLink asChild>
                    <Link to={bc.href}>{bc.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
              <BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{pageData.classLevel?.label || pageData.area?.name || pageData.subject?.name || "Delhi"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-6"
            >
              {pageData.h1}
            </motion.h1>
            {showPincode && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="text-sm text-muted-foreground mb-2"
              >
                Serving pincode: <strong>{pageData.area!.pincode}</strong>
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              {intro}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link to="/demo-booking">Start Free Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+919873101564">Call: +91-9873101564</a>
              </Button>
            </motion.div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 justify-center mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Verified Tutors</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500" /> 4.8★ Rating</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" /> Serving Delhi NCR</span>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Why Choose Tutors Parliament{pageData.area ? ` in ${pageData.area.name}` : ""}?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: CheckCircle, title: "Verified & Experienced", desc: "Every tutor undergoes background checks and qualification verification." },
                { icon: Users, title: "Personalized Learning", desc: "One-on-one attention tailored to your child's pace and learning style." },
                { icon: Clock, title: "Flexible Scheduling", desc: "Choose online or home tuition at times that work for your family." },
                { icon: BookOpen, title: "Free Demo Class", desc: "Try before you commit — experience our teaching quality risk-free." },
                { icon: Star, title: "All Boards Covered", desc: "CBSE, ICSE, IGCSE, IB, and state board curricula supported." },
                { icon: MapPin, title: "Local Tutors", desc: `Tutors available right in your area${pageData.area ? ` — ${pageData.area.name}` : ""}.` },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-background card-shadow">
                  <item.icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subjects Offered (dynamic) */}
        {pageData.subject && (
          <section className="section-padding bg-muted/20">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6 text-center">
                {pageData.subject.name} & Other Subjects{pageData.area ? ` in ${pageData.area.name}` : ""}
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {subjects.map(s => (
                  <Link
                    key={s.slug}
                    to={`/tutors/${s.slug}${pageData.area ? `-${pageData.area.slug}` : ""}-delhi`}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      s.slug === pageData.subject?.slug
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Local Trust Section */}
        {pageData.area && (
          <section className="section-padding">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
                Trusted by Students in {pageData.area.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We serve students across {pageData.area.name} and nearby areas including{" "}
                {areas.filter(a => a.slug !== pageData.area?.slug).slice(0, 4).map(a => a.name).join(", ")}.
                Our tutors understand local curriculum requirements and provide doorstep tuition at your convenience.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="p-4 rounded-xl bg-primary/5 text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-xs text-muted-foreground mt-1">Students</div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 text-center">
                  <div className="text-2xl font-bold text-primary">4.8★</div>
                  <div className="text-xs text-muted-foreground mt-1">Rating</div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs text-muted-foreground mt-1">Tutors</div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 text-center">
                  <div className="text-2xl font-bold text-primary">24h</div>
                  <div className="text-xs text-muted-foreground mt-1">Matching</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="section-padding bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq: { q: string; a: string }, i: number) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-background rounded-xl px-6 border border-border card-shadow"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Internal Links */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Related Subjects */}
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">Browse by Subject</h2>
                <ul className="space-y-2">
                  {relatedSubjects.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/tutors/${s.slug}${pageData.area ? `-${pageData.area.slug}` : ""}-delhi`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        {s.name} Tutor in {pageData.area?.name || "Delhi"}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Related Areas */}
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">Browse by Location</h2>
                <ul className="space-y-2">
                  {relatedAreas.map((a) => (
                    <li key={a.slug}>
                      <Link
                        to={`/tutors/${pageData.subject ? `${pageData.subject.slug}-` : ""}${a.slug}-delhi`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        {pageData.subject?.name || "Home"} Tutor in {a.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Related Classes */}
              {relatedClasses.length > 0 && (
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-4">Browse by Class</h2>
                  <ul className="space-y-2">
                    {relatedClasses.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to={`/${(pageData.subject?.slug || "math")}-tuition-in-${(pageData.area?.slug || "rohini")}-class-${c.slug}`}
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                          {pageData.subject?.name || "Maths"} Tuition — {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary text-primary-foreground text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
              Start Learning Today
            </h2>
            <p className="opacity-90 mb-6">
              Book a free demo class and experience personalized tutoring with Tutors Parliament.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/demo-booking">Start Free Demo</Link>
            </Button>
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
};

export default TutorSeoPage;
