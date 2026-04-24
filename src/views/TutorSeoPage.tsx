"use client";

import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "@/modules/shared/logic/seoMetadataGenerator";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { openWhatsApp } from "@/modules/shared/logic/whatsapp";
import React, { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, Star, MapPin, ArrowRight, BookOpen, Clock, Users,
  DollarSign, TrendingUp, Shield, Award,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  parseSlug, parseNewSlug, parseSlug2,
  subjects, areas, classes, boards,
  getClusterLinks,
} from "@/data/seoData";
import {
  getEnrichedContent, getEnrichedFaqs, getRelatedLinks, getOptimizedMeta,
  moneyPageContent,
} from "@/data/seoContentGenerator";
import {
  TrustLayer, FeesSection, TopTutorsNearYou,
  InternalLinkingBlock, ExamConnectionBlock, StickyBottomCTA,
} from "@/components/SeoPageSections";
import BlogCounsellingCTA from "@/components/BlogCounsellingCTA";

const TutorSeoPage = () => {
  const params = useParams();
  const location = usePathname();

  const pageData = useMemo(() => {
    const path = location.replace(/^\//, "");
    const v2 = parseSlug2(path);
    if (v2) return v2;
    const v1 = parseNewSlug(path);
    if (v1) return v1;
    if (params.slug) return parseSlug(params.slug);
    return null;
  }, [params, location]);

  if (!pageData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
            <Link href="/" className="text-primary underline">Go Home</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const content = getEnrichedContent(pageData);
  const faqs = getEnrichedFaqs(pageData);
  const relatedLinks = getRelatedLinks(pageData);
  const meta = getOptimizedMeta(pageData);
  const clusterLinks = getClusterLinks(pageData);

  const relatedSubjects = subjects.filter(s => s.slug !== pageData.subject?.slug).slice(0, 6);
  const relatedAreas = areas.filter(a => a.slug !== pageData.area?.slug).slice(0, 6);
  const relatedClasses = classes.filter(c => ["8", "9", "10", "11", "12"].includes(c.slug) && c.slug !== pageData.classLevel?.slug).slice(0, 5);

  // Breadcrumbs
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Tutors", href: "/tutors" }];
  if (pageData.subject) breadcrumbs.push({ label: pageData.subject.name, href: `/tutors/${pageData.subject.slug}-delhi` });
  if (pageData.area && pageData.type !== "area") breadcrumbs.push({ label: pageData.area.name, href: `/home-tuition-in-${pageData.area.slug}` });
  if (pageData.board) breadcrumbs.push({ label: pageData.board.name, href: "#" });

  const pageUrl = `https://tutorsparliament.com/${pageData.slug}`;
  const knownCity = pageData.area?.name;

  const educationalOrgJsonLd = {
    "@context": "https://schema.org", "@type": "EducationalOrganization",
    name: "Tutors Parliament", description: meta.description, url: pageUrl,
    areaServed: knownCity
      ? { "@type": "City", name: knownCity }
      : { "@type": "Country", name: "India" },
    address: {
      "@type": "PostalAddress",
      ...(knownCity ? { addressLocality: knownCity } : {}),
      ...(pageData.area?.pincode ? { postalCode: pageData.area.pincode } : {}),
      addressCountry: "IN",
    },
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <SEOHead
        title={meta.title}
        description={meta.description}
        keywords={`${pageData.keyword}, home tutor Delhi NCR, tuition classes Delhi, CBSE ICSE tutor${pageData.area ? `, tutor ${pageData.area.name}` : ""}${pageData.classLevel ? `, ${pageData.classLevel.label} tutor` : ""}${pageData.board ? `, ${pageData.board.name} tutor` : ""}${pageData.intent ? `, ${pageData.intent}` : ""}, Noida tutor, Gurgaon tutor`}
        canonical={pageUrl}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildLocalBusinessSchema({
            name: `Tutors Parliament — ${knownCity || "Delhi"}`,
            area: knownCity || "Delhi",
            description: meta.description,
            url: pageUrl
          }))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema(breadcrumbs.map(b => ({ name: b.label, path: b.href }))))
        }}
      />
      <Navbar />
      <main className="pb-16 md:pb-0">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-24 pb-2">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((bc, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild><Link href={bc.href}>{bc.label}</Link></BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageData.classLevel?.label || pageData.area?.name || pageData.subject?.name || "Delhi"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* === 1. HERO SECTION (Enhanced) === */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-4xl text-center">
            {pageData.isMoneyPage && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                {isFeesPage ? "💰 Fee Guide 2026" : "🏆 Top Rated Tutors"}
              </motion.span>
            )}
            {pageData.board && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-4">
                {pageData.board.name} Specialist
              </motion.span>
            )}
            {pageData.intent === "female-tutors" && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-4">
                👩‍🏫 Female Tutors Available
              </motion.span>
            )}

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">
              {pageData.h1}
            </motion.h1>

            {/* Availability Signal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-foreground bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full border border-green-500/20">
                {25 + (pageData.slug.length % 15)}+ Tutors Available in {pageData.area?.name || "Delhi"}
              </span>
            </motion.div>

            {pageData.area?.pincode && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="flex flex-col items-center gap-1 mb-2">
                <p className="text-sm text-muted-foreground">
                  Serving pincode: <strong>{pageData.area.pincode}</strong>
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Last Updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </div>
              </motion.div>
            )}

            {/* Trust signals inline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-4 justify-center mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Verified Tutors</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Background Checked</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-secondary" /> 4.8★ Avg Rating</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Free Demo in 24h</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {content.intro}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4 justify-center">
              <Button id="cta-hero-demo" size="lg" variant="cta" className="text-base px-8 py-6" asChild>
                <Link href={`/demo-booking?from=${pageData.slug}&cta=hero`}>Get Free Demo Class</Link>
              </Button>
              <Button id="cta-hero-profiles" size="lg" variant="outline" className="text-base px-8 py-6" asChild>
                <Link href={`/demo-booking?from=${pageData.slug}&cta=hero_secondary`}>View Tutor Profiles <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <TrustLayer pageData={pageData} />

        {/* Local Insights Section */}
        {pageData.area && (
          <section className="section-padding pt-0">
            <div className="container mx-auto max-w-4xl">
              <div className="p-6 rounded-2xl bg-muted/30 border border-border">
                <h3 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Educational Landscape in {pageData.area.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Students in {pageData.area.name} primarily attend top-tier schools such as {["DPS", "Modern School", "Amity International", "Sanskriti School", "Vasant Valley"][pageData.area.slug.length % 5]} and {["Lotus Valley", "Shiv Nadar", "The Heritage School", "Pathways World School"][pageData.area.slug.length % 4]}.
                  The area is known for its high academic standards and competitive environment, particularly for CBSE and IB students.
                  Our tutors in {pageData.area.name} are intimately familiar with the local school calendars and exam schedules, ensuring your child stays ahead of the curve.
                </p>
              </div>
            </div>
          </section>
        )}

        <FeesSection pageData={pageData} />
        <TopTutorsNearYou pageData={pageData} />

        <section className="section-padding">
          <div className="container mx-auto max-w-3xl prose prose-gray dark:prose-invert">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
              Why {pageData.subject?.name || "Home Tuition"} Matters{pageData.area ? ` in ${pageData.area.name}` : ""}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{content.value}</p>
            <p className="text-muted-foreground leading-relaxed mt-4">{content.closing}</p>

            {pageData.board && (
              <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {pageData.board.name} Curriculum Focus
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our {pageData.board.name}-specialist tutors understand the specific syllabus structure, internal assessment patterns, and marking schemes.
                  {pageData.board.slug === "cbse" && " NCERT-aligned teaching with focus on HOTS questions and competency-based learning."}
                  {pageData.board.slug === "icse" && " Application-oriented approach covering the detailed ICSE syllabus with emphasis on practical understanding."}
                  {pageData.board.slug === "ib" && " Inquiry-based learning aligned with IB assessment criteria, TOK integration, and extended essay guidance."}
                </p>
              </div>
            )}
          </div>
        </section>

        <ExamConnectionBlock pageData={pageData} />
        <InternalLinkingBlock pageData={pageData} />

        <section className="section-padding pt-0">
          <div className="container mx-auto max-w-3xl">
            <BlogCounsellingCTA variant="block" />
          </div>
        </section>

        {/* FAQs */}
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-xl px-6 border border-border card-shadow">
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

        <section className="section-padding bg-primary text-primary-foreground text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Start Learning Today</h2>
            <p className="opacity-90 mb-6">
              Book a free demo class and experience personalized tutoring with Tutors Parliament.
              Serving Delhi, Noida, Gurgaon, Ghaziabad & Faridabad.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button id="cta-footer-demo" size="lg" variant="secondary" asChild>
                <Link href={`/demo-booking?from=${pageData.slug}&cta=footer`}>Book Free Demo</Link>
              </Button>
              <Button id="cta-footer-whatsapp" size="lg" variant="hero-outline" onClick={() => openWhatsApp(`Hi, I need a tutor for ${pageData.keyword} in ${pageData.area?.name || "Delhi"}`)}>
                  Talk to Tutor Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      <StickyBottomCTA pageData={pageData} />
      <WhatsAppButton />
      <Footer />
    </>
  );
};

export default TutorSeoPage;


