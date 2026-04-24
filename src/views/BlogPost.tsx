"use client";

import { getRelevantTutoringPages } from "@/data/seoContentGenerator";
import { MapPin } from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, Download, Mail, RefreshCw, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BlogReadingProgress from "@/components/BlogReadingProgress";
import BlogCTA from "@/components/BlogCTA";
import BlogCounsellingCTA from "@/components/BlogCounsellingCTA";
import BlogSocialShare from "@/components/BlogSocialShare";
import BlogImage from "@/components/BlogImage";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { getPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { toast } from "@/hooks/use-toast";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  organizationSchema,
} from "@/modules/shared/logic/seoMetadataGenerator";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || "");
  const related = getRelatedPosts(slug || "", 3);
  const [email, setEmail] = useState("");

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading font-bold text-3xl mb-4">Blog Post Not Found</h1>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const canonicalUrl = `https://tutorsparliament.com/blog/${post.slug}`;
  const currentUrl = typeof window !== "undefined" ? window.location.href : canonicalUrl;

  const handleEmailCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Thank you!", description: "Your free study plan will be sent to your email shortly." });
    setEmail("");
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  const structuredData = [
    organizationSchema,
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    buildArticleSchema({
      headline: post.title,
      description: post.metaDescription,
      image: post.heroImage,
      datePublished: post.date,
      dateModified: post.updatedDate ?? post.date,
      url: canonicalUrl,
    }),
    ...(post.faqs && post.faqs.length > 0 ? [buildFaqSchema(post.faqs)] : []),
  ];

  // Drop the counselling CTA roughly halfway through the article body.
  const midContentIndex = Math.max(1, Math.floor(post.content.length / 2));

  // Internal-link suggestions: 2 same-category posts (excluding related ones already shown).
  const relatedSlugs = new Set(related.map((r) => r.slug));
  const internalLinks = getRelatedPosts(post.slug, 6)
    .filter((p) => !relatedSlugs.has(p.slug))
    .slice(0, 2);

  const tutoringLinks = getRelevantTutoringPages(post.slug);

  const keywords = `${post.targetKeyword}, ${post.category}${post.city ? `, ${post.city}` : ""}, Tutors Parliament`;

  return (
    <>
      <SEOHead
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={canonicalUrl}
        keywords={keywords}
        structuredData={structuredData}
      />
      <BlogReadingProgress />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-12 section-padding" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto max-w-4xl">
            <PageBreadcrumbs items={breadcrumbItems} variant="onDark" className="mb-6" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-primary-foreground/70 text-lg mb-6">{post.metaDescription}</p>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/60 flex-wrap">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Published {post.date}</span>
                {post.updatedDate && post.updatedDate !== post.date && (
                  <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" /> Updated {post.updatedDate}</span>
                )}
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        <div className="container mx-auto max-w-4xl -mt-6 px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden card-shadow"
          >
            <BlogImage
              src={post.heroImage}
              alt={post.title}
              width={1200}
              height={630}
              eager
              fetchPriority="high"
              className="w-full h-64 md:h-96 object-cover"
            />
          </motion.div>
        </div>

        {/* Content */}
        <article className="container mx-auto max-w-4xl section-padding pb-8">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <BlogSocialShare title={post.title} url={currentUrl} />
          </div>

          {/* Blog Sections */}
          <div className="prose prose-lg max-w-none">
            {post.content.map((section, i) => (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="mb-8"
                >
                  {section.heading && section.headingLevel === "h2" && (
                    <h2 className="font-heading font-bold text-2xl text-foreground mt-10 mb-4">{section.heading}</h2>
                  )}
                  {section.heading && section.headingLevel === "h3" && (
                    <h3 className="font-heading font-semibold text-xl text-foreground mt-8 mb-3">{section.heading}</h3>
                  )}
                  {section.paragraphs.map((p, pi) => (
                    <p key={pi} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
                  ))}
                  {section.bullets && (
                    <ul className="space-y-2 mb-4">
                      {section.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>

                {/* Mid-content counselling CTA */}
                {i === midContentIndex && <BlogCounsellingCTA variant="inline" postSlug={post.slug} />}
              </div>
            ))}
          </div>

          {/* FAQ Section (also emitted as JSON-LD via FAQPage schema) */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="font-heading font-bold text-2xl text-foreground">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {post.faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="font-heading font-semibold text-foreground mb-2">{f.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Internal links */}
          {internalLinks.length > 0 && (
            <aside className="mt-10 rounded-xl border border-border bg-muted/40 p-5">
              <p className="text-sm font-heading font-semibold text-foreground mb-2">
                Continue reading
              </p>
              <ul className="space-y-1.5">
                {internalLinks.map((il) => (
                  <li key={il.id}>
                    <Link
                      href={`/blog/${il.slug}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5" /> {il.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Reciprocal Linking: Related Tutoring Pages */}
          {tutoringLinks.length > 0 && (
            <aside className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-heading font-bold text-primary mb-3 uppercase tracking-wider">
                Recommended Tutoring Near You
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {tutoringLinks.map((tl, i) => (
                  <Link
                    key={i}
                    id={`cta-blog-rec-${tl.href.replace(/\//g, "")}`}
                    href={`${tl.href}?from=blog_${post.slug}&cta=blog_recommendation`}
                    className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border hover:border-primary transition-colors text-sm font-medium text-foreground group"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="group-hover:text-primary transition-colors">{tl.anchor}</span>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          {/* Lead Magnet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-accent rounded-2xl p-6 md:p-8 my-10"
          >
            <div className="flex items-start gap-3 mb-4">
              <Download className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">Download Free Study Plan PDF</h3>
                <p className="text-muted-foreground text-sm">Get a personalized study plan template designed for Indian students. Enter your email below.</p>
              </div>
            </div>
            <form onSubmit={handleEmailCapture} className="flex gap-3 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" variant="cta" className="gap-2">
                <Mail className="w-4 h-4" /> Get PDF
              </Button>
            </form>
          </motion.div>

          {/* Blog CTA — demo-focused */}
          <BlogCTA postSlug={post.slug} />

          {/* Counselling CTA — end of article */}
          <BlogCounsellingCTA postSlug={post.slug} />

          {/* Related Blogs */}
          <section className="mt-16">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-40 overflow-hidden">
                    <BlogImage
                      src={rp.heroImage}
                      alt={rp.title}
                      width={400}
                      height={160}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-secondary">{rp.category}</span>
                    <h3 className="font-heading font-semibold text-sm text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {rp.title}
                    </h3>
                    <span className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      {rp.readTime} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to All Articles
              </Button>
            </Link>
          </div>
        </article>

        {/* Sticky CTA */}
        <div className="fixed bottom-6 right-6 z-50 hidden md:block">
          <Button id="cta-blog-sticky-demo" variant="cta" size="lg" className="rounded-full shadow-xl gap-2" asChild>
            <Link href={`/demo-booking?from=blog_${post.slug}&cta=blog_sticky`}><Calendar className="w-5 h-5" /> Start Free Demo</Link>
          </Button>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BlogPost;


