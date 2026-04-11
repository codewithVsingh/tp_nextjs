import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, MapPin, ArrowRight } from "lucide-react";
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
  getIntro,
  getFaqs,
  subjects,
  areas,
} from "@/data/seoData";

const TutorSeoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const pageData = useMemo(() => (slug ? parseSlug(slug) : null), [slug]);

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

  const idx = pageData.slug.length; // deterministic rotation index
  const intro = getIntro(pageData.keyword, "Delhi", idx);
  const faqs = getFaqs(pageData.keyword, pageData.area?.name, idx);

  // Related links
  const relatedSubjects = subjects
    .filter((s) => s.slug !== pageData.subject?.slug)
    .slice(0, 6);
  const relatedAreas = areas
    .filter((a) => a.slug !== pageData.area?.slug)
    .slice(0, 6);

  // Breadcrumb
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tutors", href: "/tutors/math-delhi" },
  ];
  if (pageData.type === "subject-area") {
    breadcrumbs.push({
      label: pageData.subject!.name,
      href: `/tutors/${pageData.subject!.slug}-delhi`,
    });
  }

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Tutors Parliament",
    description: pageData.metaDescription,
    url: `https://tutorsparliament.com/tutors/${pageData.slug}`,
    areaServed: {
      "@type": "City",
      name: pageData.area?.name || "Delhi",
    },
    ...(faqs.length > 0 && {
      mainEntity: faqs.map((f: { q: string; a: string }) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
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

  return (
    <>
      <SEOHead
        title={pageData.title}
        description={pageData.metaDescription}
        keywords={`${pageData.keyword}, home tutor Delhi, tuition classes Delhi, CBSE ICSE tutor`}
        canonical={`https://tutorsparliament.com/tutors/${pageData.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
                <BreadcrumbPage>{pageData.area?.name || pageData.subject?.name || "Delhi"}</BreadcrumbPage>
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

        {/* Why Choose Us */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Why Choose Tutors Parliament{pageData.area ? ` in ${pageData.area.name}` : ""}?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Verified & Experienced", desc: "Every tutor undergoes background checks and qualification verification." },
                { title: "Personalized Learning", desc: "One-on-one attention tailored to your child's pace and learning style." },
                { title: "Flexible Scheduling", desc: "Choose online or home tuition at times that work for your family." },
                { title: "Free Demo Class", desc: "Try before you commit — experience our teaching quality risk-free." },
                { title: "All Boards Covered", desc: "CBSE, ICSE, IGCSE, IB, and state board curricula supported." },
                { title: "Affordable Plans", desc: "Competitive pricing with flexible monthly plans for every budget." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-border bg-background card-shadow"
                >
                  <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
            <div className="grid md:grid-cols-2 gap-10">
              {/* Related Subjects */}
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                  Browse by Subject
                </h2>
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
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                  Browse by Location
                </h2>
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
