import { useParams, useLocation, Link } from "react-router-dom";
import { openWhatsApp } from "@/lib/whatsapp";
import { useMemo } from "react";
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
  const location = useLocation();

  const pageData = useMemo(() => {
    const path = location.pathname.replace(/^\//, "");
    const v2 = parseSlug2(path);
    if (v2) return v2;
    const v1 = parseNewSlug(path);
    if (v1) return v1;
    if (params.slug) return parseSlug(params.slug);
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

  const content = getEnrichedContent(pageData);
  const faqs = getEnrichedFaqs(pageData);
  const relatedLinks = getRelatedLinks(pageData);
  const meta = getOptimizedMeta(pageData);
  const clusterLinks = getClusterLinks(pageData);

  const relatedSubjects = subjects.filter(s => s.slug !== pageData.subject?.slug).slice(0, 6);
  const relatedAreas = areas.filter(a => a.slug !== pageData.area?.slug).slice(0, 6);
  const relatedClasses = classes.filter(c => ["8", "9", "10", "11", "12"].includes(c.slug) && c.slug !== pageData.classLevel?.slug).slice(0, 5);

  // Breadcrumbs
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Tutors", href: "/tutors/math-delhi" }];
  if (pageData.subject) breadcrumbs.push({ label: pageData.subject.name, href: `/tutors/${pageData.subject.slug}-delhi` });
  if (pageData.area && pageData.type !== "area") breadcrumbs.push({ label: pageData.area.name, href: `/tutors/${pageData.area.slug}-delhi` });
  if (pageData.board) breadcrumbs.push({ label: pageData.board.name, href: "#" });

  const pageUrl = `https://tutorsparliament.com/${pageData.slug}`;
  const showPincode = !!pageData.area?.pincode;

  const isFeesPage = pageData.type === "tuition-fees-area" || pageData.type === "subject-area-fees";
  const isTopTutorsPage = pageData.type === "top-tutors-area";

  // JSON-LD — only emit address fields when we actually know a city; otherwise stay India-wide.
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
  const localBusinessJsonLd = {
    "@context": "https://schema.org", "@type": "LocalBusiness",
    name: `Tutors Parliament${knownCity ? ` — ${knownCity}` : ""}`, description: meta.description, url: pageUrl,
    telephone: "+91-9873101564",
    address: {
      "@type": "PostalAddress",
      ...(knownCity ? { addressLocality: knownCity } : {}),
      ...(pageData.area?.pincode ? { postalCode: pageData.area.pincode } : {}),
      addressCountry: "IN",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "2500" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Navbar />
      <main className="pb-16 md:pb-0">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-24 pb-2">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((bc, i) => (
                <BreadcrumbItem key={i}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbLink asChild><Link to={bc.href}>{bc.label}</Link></BreadcrumbLink>
                </BreadcrumbItem>
              ))}
              <BreadcrumbItem>
                <BreadcrumbSeparator />
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
                {isFeesPage ? "💰 Fee Guide 2025" : "🏆 Top Rated Tutors"}
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

            {showPincode && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="text-sm text-muted-foreground mb-2">
                Serving pincode: <strong>{pageData.area!.pincode}</strong>
              </motion.p>
            )}

            {/* Trust signals inline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-4 justify-center mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Verified Tutors</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Background Checked</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-secondary" /> 4.8★ Avg Rating</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Free Demo in 24h</span>
              {pageData.board && <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-primary" /> {pageData.board.name} Experts</span>}
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {content.intro}
            </motion.p>

            {/* 2 CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="cta" className="text-base px-8 py-6" asChild>
                <Link to="/demo-booking">Get Free Demo Class</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6" asChild>
                <Link to="/demo-booking">View Tutor Profiles <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* === 2. TRUST LAYER === */}
        <TrustLayer pageData={pageData} />

        {/* === MONEY PAGE: Fee Breakdown === */}
        {isFeesPage && pageData.area && (
          <section className="section-padding">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 text-center">
                <DollarSign className="inline h-7 w-7 text-primary mr-2" />
                Tuition Fee Breakdown — {pageData.area.name}
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                {moneyPageContent.fees(pageData.area.name).intro}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-heading font-semibold text-foreground">Class Range</th>
                      <th className="text-left p-3 font-heading font-semibold text-foreground">Fee Range</th>
                      <th className="text-left p-3 font-heading font-semibold text-foreground hidden sm:table-cell">Includes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moneyPageContent.fees(pageData.area.name).breakdown.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-foreground font-medium">{row.range}</td>
                        <td className="p-3 text-primary font-bold">{row.fee}</td>
                        <td className="p-3 text-muted-foreground text-sm hidden sm:table-cell">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-3">Factors Affecting Fees</h3>
                <ul className="space-y-2">
                  {moneyPageContent.fees(pageData.area.name).factors.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* === MONEY PAGE: Top Tutors === */}
        {isTopTutorsPage && pageData.area && (
          <section className="section-padding">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 text-center">
                <Award className="inline h-7 w-7 text-primary mr-2" />
                Selection Criteria
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                {moneyPageContent.topTutors(pageData.area.name).intro}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {moneyPageContent.topTutors(pageData.area.name).criteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-foreground text-sm">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* === 3. FEES SECTION (for non-fee-specific pages) === */}
        {!isFeesPage && <FeesSection pageData={pageData} />}

        {/* === 4. TOP TUTORS NEAR YOU === */}
        <TopTutorsNearYou pageData={pageData} />

        {/* Enriched Content */}
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl prose prose-gray dark:prose-invert">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
              {pageData.intent === "home-vs-online"
                ? "Home Tuition vs Online Classes — Which is Better?"
                : `Why ${pageData.subject?.name || "Home Tuition"} Matters${pageData.area ? ` in ${pageData.area.name}` : ""}`}
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

        {/* Benefits */}
        <section className="section-padding bg-muted/20">
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
                { icon: Star, title: "All Boards Covered", desc: `CBSE, ICSE, IGCSE, IB, and state board curricula supported.` },
                { icon: Shield, title: "Satisfaction Guarantee", desc: "Not happy? We'll assign a new tutor at no extra cost." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl border border-border bg-background card-shadow"
                >
                  <item.icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* === 6. EXAM CONNECTION BLOCK === */}
        <ExamConnectionBlock pageData={pageData} />

        {/* === 5. INTERNAL LINKING BLOCK === */}
        <InternalLinkingBlock pageData={pageData} />

        {/* Counselling CTA — pairs naturally with academic decisions */}
        <section className="section-padding pt-0">
          <div className="container mx-auto max-w-3xl">
            <BlogCounsellingCTA variant="block" />
          </div>
        </section>

        {/* Subjects / Boards Offered */}
        {pageData.subject && (
          <section className="section-padding">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6 text-center">
                {pageData.subject.name} & Other Subjects{pageData.area ? ` in ${pageData.area.name}` : ""}
              </h2>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {subjects.map(s => (
                  <Link key={s.slug} to={`/tutors/${s.slug}${pageData.area ? `-${pageData.area.slug}` : ""}-delhi`}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${s.slug === pageData.subject?.slug ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                    {s.name}
                  </Link>
                ))}
              </div>
              {pageData.area && pageData.classLevel && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {boards.map(b => (
                    <Link key={b.slug} to={`/${pageData.subject!.slug}-home-tutor-${pageData.area!.slug}-class-${pageData.classLevel!.slug}-${b.slug}`}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${b.slug === pageData.board?.slug ? "bg-secondary text-secondary-foreground border-secondary" : "bg-background border-border text-muted-foreground hover:border-secondary"}`}>
                      {b.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Local Trust */}
        {pageData.area && (
          <section className="section-padding bg-muted/20">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
                Trusted by Students in {pageData.area.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We serve students across {pageData.area.name} and nearby areas including{" "}
                {areas.filter(a => a.slug !== pageData.area?.slug).slice(0, 4).map(a => a.name).join(", ")}.
                Covering Delhi, Noida, Gurgaon, Ghaziabad & Faridabad.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {[
                  { val: "10K+", label: "Students" },
                  { val: "4.8★", label: "Rating" },
                  { val: "500+", label: "Tutors" },
                  { val: "24h", label: "Matching" },
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-primary/5 text-center">
                    <div className="text-2xl font-bold text-primary">{s.val}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* === 7. FAQs (Schema Enabled) === */}
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

        {/* Topical Authority Cluster Links */}
        {clusterLinks.length > 0 && (
          <section className="section-padding bg-primary/5">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 text-center">
                Explore This Topic
              </h2>
              <p className="text-muted-foreground text-center text-sm mb-6">Related pages in this cluster</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {clusterLinks.map((link, i) => (
                  <Link key={i} to={link.href}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors text-sm ${link.isPillar ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"}`}>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    {link.isPillar && <span className="text-[10px] uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">Pillar</span>}
                    {link.anchor}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Pages */}
        <section className="section-padding bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6 text-center">
              Related Pages
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedLinks.map((link, i) => (
                <Link key={i} to={link.href} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-background hover:border-primary hover:text-primary transition-colors text-sm text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  {link.anchor}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Subject/Area/Class */}
        <section className="section-padding">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">Browse by Subject</h2>
                <ul className="space-y-2">
                  {relatedSubjects.map(s => (
                    <li key={s.slug}>
                      <Link to={`/tutors/${s.slug}${pageData.area ? `-${pageData.area.slug}` : ""}-delhi`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-3.5 w-3.5" />{s.name} Tutor in {pageData.area?.name || "Delhi"}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">Browse by Location</h2>
                <ul className="space-y-2">
                  {relatedAreas.map(a => (
                    <li key={a.slug}>
                      <Link to={`/tutors/${pageData.subject ? `${pageData.subject.slug}-` : ""}${a.slug}-delhi`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-3.5 w-3.5" />{pageData.subject?.name || "Home"} Tutor in {a.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {relatedClasses.length > 0 && (
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-4">Browse by Class</h2>
                  <ul className="space-y-2">
                    {relatedClasses.map(c => (
                      <li key={c.slug}>
                        <Link to={`/${(pageData.subject?.slug || "math")}-tuition-in-${(pageData.area?.slug || "rohini")}-class-${c.slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                          <ArrowRight className="h-3.5 w-3.5" />{pageData.subject?.name || "Maths"} Tuition — {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding bg-primary text-primary-foreground text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Start Learning Today</h2>
            <p className="opacity-90 mb-6">
              Book a free demo class and experience personalized tutoring with Tutors Parliament.
              Serving Delhi, Noida, Gurgaon, Ghaziabad & Faridabad.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/demo-booking">Book Free Demo</Link>
              </Button>
              <Button size="lg" variant="hero-outline" onClick={() => openWhatsApp("Hi, I need a tutor")}>
                  Talk to Tutor Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* === 8. STICKY BOTTOM CTA (Mobile) === */}
      <StickyBottomCTA pageData={pageData} />
      <WhatsAppButton />
      <Footer />
    </>
  );
};

export default TutorSeoPage;
