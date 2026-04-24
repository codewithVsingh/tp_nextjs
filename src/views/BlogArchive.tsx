"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";;
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import BlogImage from "@/components/BlogImage";
import { Button } from "@/components/ui/button";
import { blogPosts, type BlogPost } from "@/data/blogPosts";
import { organizationSchema, buildBreadcrumbSchema } from "@/modules/shared/logic/seoMetadataGenerator";

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const MONTH_LABEL = MONTHS.map(m => m[0].toUpperCase() + m.slice(1));

const parsePostDate = (d: string) => {
  const t = Date.parse(d);
  return isNaN(t) ? null : new Date(t);
};

const BlogArchive = () => {
  const { year, month } = useParams<{ year: string; month?: string }>();
  const yearNum = Number(year);
  const monthIdx = month ? MONTHS.indexOf(month.toLowerCase()) : -1;
  const isMonth = !!month;
  const validYear = !!year && /^\d{4}$/.test(year);
  const validMonth = !isMonth || monthIdx >= 0;

  const posts = useMemo<BlogPost[]>(() => {
    if (!validYear || !validMonth) return [];
    return blogPosts
      .filter(p => {
        const d = parsePostDate(p.updatedDate || p.date);
        if (!d) return false;
        if (d.getFullYear() !== yearNum) return false;
        if (isMonth && d.getMonth() !== monthIdx) return false;
        return true;
      })
      .sort((a, b) => {
        const da = parsePostDate(a.updatedDate || a.date)?.getTime() ?? 0;
        const db = parsePostDate(b.updatedDate || b.date)?.getTime() ?? 0;
        return db - da;
      });
  }, [yearNum, monthIdx, isMonth, validYear, validMonth]);

  // Months that have content for this year (for year-level archive index)
  const monthsWithContent = useMemo(() => {
    if (!validYear || isMonth) return [];
    const set = new Set<number>();
    blogPosts.forEach(p => {
      const d = parsePostDate(p.updatedDate || p.date);
      if (d && d.getFullYear() === yearNum) set.add(d.getMonth());
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [yearNum, isMonth, validYear]);

  const monthLabel = isMonth ? MONTH_LABEL[monthIdx] : "";
  const heading = isMonth ? `${monthLabel} ${yearNum}` : `${yearNum}`;
  const title = `Blog Archive — ${heading} | Tutors Parliament`;
  const description = isMonth
    ? `All Tutors Parliament blog posts published in ${monthLabel} ${yearNum} — tutoring, study, parenting, counselling and exam guides.`
    : `Browse all Tutors Parliament blog posts from ${yearNum} — organised by month for easy discovery.`;
  const path = isMonth
    ? `/blog/archive/${yearNum}/${MONTHS[monthIdx]}`
    : `/blog/archive/${yearNum}`;
  const canonical = `https://tutorsparliament.com${path}`;

  if (!validYear || !validMonth) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center section-padding">
          <div className="text-center">
            <h1 className="font-heading font-bold text-2xl mb-3">Archive not found</h1>
            <Button asChild><Link href="/blog">Back to Blog</Link></Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={canonical}
        structuredData={[
          organizationSchema,
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: `${yearNum}`, path: `/blog/archive/${yearNum}` },
            ...(isMonth ? [{ name: monthLabel, path }] : []),
          ]),
        ]}
      />
      <Navbar />
      <main>
        <section className="pt-24 pb-10 section-padding" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto text-center">
            <PageBreadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                ...(isMonth
                  ? [{ label: `${yearNum}`, href: `/blog/archive/${yearNum}` }, { label: monthLabel }]
                  : [{ label: `${yearNum}` }]),
              ]}
              variant="onDark"
              className="mb-5 justify-center"
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mb-3"
            >
              Archive — <span className="text-secondary">{heading}</span>
            </motion.h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">
              {posts.length} {posts.length === 1 ? "article" : "articles"} published in {heading}.
            </p>
          </div>
        </section>

        {!isMonth && monthsWithContent.length > 0 && (
          <section className="section-padding pb-0 pt-10">
            <div className="container mx-auto">
              <h2 className="font-heading font-bold text-xl text-foreground mb-4">Browse by Month</h2>
              <div className="flex flex-wrap gap-2">
                {monthsWithContent.map(m => (
                  <Button key={m} variant="outline" size="sm" className="rounded-full" asChild>
                    <Link href={`/blog/archive/${yearNum}/${MONTHS[m]}`}>
                      {MONTH_LABEL[m]} {yearNum}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding">
          <div className="container mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-6">No articles in this archive yet.</p>
                <Button asChild variant="outline">
                  <Link href="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog</Link>
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="bg-background rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 group flex flex-col"
                  >
                    <Link href={`/blog/${post.slug}`} className="block flex-1 flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <BlogImage
                          src={post.heroImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-heading font-bold text-lg text-foreground leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.updatedDate || post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.readTime}
                          </span>
                        </div>
                        <span className="mt-4 text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
};

export default BlogArchive;


