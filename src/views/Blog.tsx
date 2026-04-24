"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock, Search, MapPin, TrendingUp, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BlogCTA from "@/components/BlogCTA";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import BlogImage from "@/components/BlogImage";
import {
  blogPosts,
  blogCategories,
  blogCities,
  getFeaturedPosts,
  type BlogPost,
} from "@/data/blogPosts";
import { organizationSchema, buildBreadcrumbSchema } from "@/modules/shared/logic/seoMetadataGenerator";

const PAGE_SIZE = 9;
type SortMode = "recent" | "popular" | "trending";

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
/** Best-effort date parser for the human-readable post dates. */
const parseDate = (d: string) => {
  const parsed = Date.parse(d);
  return isNaN(parsed) ? 0 : parsed;
};

const sortPosts = (posts: BlogPost[], mode: SortMode): BlogPost[] => {
  const arr = [...posts];
  if (mode === "popular") {
    arr.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
  } else if (mode === "trending") {
    arr.sort((a, b) => Number(!!b.trending) - Number(!!a.trending) || (b.views ?? 0) - (a.views ?? 0));
  } else {
    arr.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  }
  return arr;
};

const Blog = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = params.get("category") ?? "All";
  const activeCity = params.get("city") ?? "All Cities";
  const sortMode = (params.get("sort") as SortMode) ?? "recent";
  const searchQuery = params.get("q") ?? "";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  const updateParam = (key: string, value: string | null, opts?: { resetPage?: boolean }) => {
    const next = new URLSearchParams(params);
    if (!value || value === "All" || value === "All Cities") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (opts?.resetPage !== false) next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const featured = useMemo(() => getFeaturedPosts(3), []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return blogPosts.filter((post) => {
      if (activeCategory !== "All" && post.category !== activeCategory) return false;
      if (activeCity !== "All Cities" && post.city !== activeCity) return false;
      if (q) {
        const hay = (post.title + " " + post.excerpt + " " + post.category).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activeCategory, activeCity, searchQuery]);

  const sorted = useMemo(() => sortPosts(filtered, sortMode), [filtered, sortMode]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (n: number) => {
    const next = new URLSearchParams(params);
    if (n <= 1) next.delete("page");
    else next.set("page", String(n));
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortTabs: { id: SortMode; label: string; icon: typeof Sparkles }[] = [
    { id: "recent", label: "Recent", icon: Sparkles },
    { id: "popular", label: "Popular", icon: Star },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ];

  const canonicalBase = "https://tutorsparliament.com/blog";
  const canonical =
    safePage > 1 ? `${canonicalBase}?page=${safePage}` : canonicalBase;

  return (
    <>
      <SEOHead
        title={
          safePage > 1
            ? `Blog & Resources — Page ${safePage} | Tutors Parliament`
            : "Blog & Resources — Tutoring, Study Tips & Parenting Across India | Tutors Parliament"
        }
        description="Pan-India tutoring, study, parenting, counselling, mental wellness and competitive exam guidance — written by Tutors Parliament educators."
        canonical={canonical}
        keywords="education blog India, study tips, tutoring blog, board exam preparation, parenting tips, mental health students, competitive exams"
        structuredData={[
          organizationSchema,
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-12 section-padding" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto text-center">
            <PageBreadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
              variant="onDark"
              className="mb-6 justify-center"
            />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mb-4">
                Blog & <span className="text-secondary">Resources</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                Pan-India tutoring, study, parenting, mental wellness and career guidance — written by Tutors Parliament educators.
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => updateParam("q", e.target.value)}
                  className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-secondary"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Section */}
        {featured.length > 0 && safePage === 1 && !searchQuery && activeCategory === "All" && activeCity === "All Cities" && (
          <section className="section-padding pb-0 pt-12">
            <div className="container mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-secondary fill-secondary" />
                <h2 className="font-heading font-bold text-xl md:text-2xl text-foreground">Featured Articles</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featured.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`relative bg-background rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 group ${
                      i === 0 ? "md:col-span-2 md:row-span-2" : ""
                    }`}
                  >
                    <Link href={`/blog/${post.slug}`} className="block h-full">
                      <div className={`relative overflow-hidden ${i === 0 ? "h-64 md:h-80" : "h-44"}`}>
                        <BlogImage
                          src={post.heroImage}
                          alt={post.title}
                          eager={i === 0}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                          {post.city && post.city !== "Pan India" && (
                            <span className="bg-background/90 text-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {post.city}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3
                            className={`font-heading font-bold text-primary-foreground leading-tight ${
                              i === 0 ? "text-xl md:text-2xl" : "text-base"
                            }`}
                          >
                            {post.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sort + Filters */}
        <section className="section-padding pt-10 pb-0">
          <div className="container mx-auto space-y-5">
            {/* Sort tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-1">Sort:</span>
              {sortTabs.map((tab) => {
                const Icon = tab.icon;
                const active = sortMode === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateParam("sort", tab.id)}
                    className="rounded-full gap-1.5"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateParam("category", cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* City chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground mr-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> City:
              </span>
              {blogCities.map((city) => {
                const active = activeCity === city;
                if (city === "All Cities") {
                  return (
                    <Button
                      key={city}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateParam("city", city)}
                      className="rounded-full"
                    >
                      {city}
                    </Button>
                  );
                }
                return (
                  <Button
                    key={city}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateParam("city", city)}
                    className="rounded-full"
                    asChild={false}
                  >
                    {city}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="section-padding pt-8">
          <div className="container mx-auto">
            <p className="text-sm text-muted-foreground mb-6">
              {sorted.length} {sorted.length === 1 ? "article" : "articles"}
              {activeCategory !== "All" && ` in ${activeCategory}`}
              {activeCity !== "All Cities" && ` for ${activeCity}`}
            </p>

            {pageItems.length === 0 ? (
              <div className="py-8">
                <p className="text-center text-muted-foreground mb-8">
                  No articles match this filter combination yet. Here are related reads:
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(activeCategory !== "All"
                    ? blogPosts.filter((p) => p.category === activeCategory)
                    : activeCity !== "All Cities"
                      ? blogPosts.filter((p) => p.city === activeCity)
                      : blogPosts
                  )
                    .slice(0, 6)
                    .map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block bg-background rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all p-6"
                      >
                        <span className="bg-secondary/15 text-secondary text-xs font-semibold px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                        <h3 className="font-heading font-bold text-base text-foreground mt-3 mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                      </Link>
                    ))}
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pageItems.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className="bg-background rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1.5 group flex flex-col"
                    >
                      <Link href={`/blog/${post.slug}`} className="block flex-1 flex flex-col">
                        <div className="relative h-52 overflow-hidden">
                          <BlogImage
                            src={post.heroImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                              {post.category}
                            </span>
                            {post.trending && (
                              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Trending
                              </span>
                            )}
                          </div>
                          {post.city && post.city !== "Pan India" && (
                            <span className="absolute bottom-3 left-3 bg-background/90 text-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {post.city}
                            </span>
                          )}
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="font-heading font-bold text-lg text-foreground leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.updatedDate ? `Updated ${post.updatedDate}` : post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {post.readTime}
                            </span>
                          </div>
                          <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                            Read More <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-12 flex flex-wrap items-center justify-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage === 1}
                      onClick={() => goToPage(safePage - 1)}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <Button
                        key={n}
                        variant={n === safePage ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(n)}
                        aria-current={n === safePage ? "page" : undefined}
                        className="min-w-9"
                      >
                        {n}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage === totalPages}
                      onClick={() => goToPage(safePage + 1)}
                      className="gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </nav>
                )}

                {/* City quick links */}
                <div className="mt-16 pt-10 border-t border-border">
                  <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
                    Browse by City
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {blogCities
                      .filter((c) => c !== "All Cities" && c !== "Pan India")
                      .map((c) => (
                        <Link
                          key={c}
                          href={`/blog/city/${toSlug(c)}`}
                          className="text-sm bg-accent text-accent-foreground px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {c}
                        </Link>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="section-padding pt-0">
          <div className="container mx-auto">
            <BlogCTA postSlug="blog_index" />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Blog;


