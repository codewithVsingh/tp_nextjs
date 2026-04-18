import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import BlogImage from "@/components/BlogImage";
import { getPostsByCity, blogCities } from "@/data/blogPosts";
import { organizationSchema, buildBreadcrumbSchema } from "@/lib/seoSchema";

/** Slugify a city for matching the URL param. */
const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const BlogCity = () => {
  const { city: citySlug } = useParams<{ city: string }>();
  const cityName = blogCities.find(
    (c) => c !== "All Cities" && toSlug(c) === citySlug,
  );

  if (!cityName) {
    return <Navigate to="/blog" replace />;
  }

  const posts = getPostsByCity(cityName);
  const canonical = `https://tutorsparliament.com/blog/city/${citySlug}`;

  return (
    <>
      <SEOHead
        title={`Tuition, Study & Parenting Articles for ${cityName} | Tutors Parliament`}
        description={`Local tuition, parenting and exam preparation articles tailored for families in ${cityName}. Verified tutors, school guides and counselling.`}
        canonical={canonical}
        keywords={`${cityName} tuition blog, ${cityName} home tutor, ${cityName} parenting tips`}
        structuredData={[
          organizationSchema,
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: cityName, path: `/blog/city/${citySlug}` },
          ]),
        ]}
      />
      <Navbar />
      <main>
        <section
          className="pt-24 pb-12 section-padding"
          style={{ background: "var(--hero-gradient)" }}
        >
          <div className="container mx-auto">
            <PageBreadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: cityName },
              ]}
              variant="onDark"
              className="mb-6"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-primary-foreground mb-4">
                {cityName} <span className="text-secondary">Tutoring & Education</span>
              </h1>
              <p className="text-primary-foreground/80 text-base md:text-lg">
                Articles, tutor guides and counselling resources crafted for families in {cityName}.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-6">
                  No articles for {cityName} yet — try our pan-India library.
                </p>
                <Link to="/blog" className="text-primary font-semibold underline">
                  Browse all articles
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-background rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1.5 group"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
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
                      <div className="p-6">
                        <h3 className="font-heading font-bold text-lg text-foreground leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {post.date}
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
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BlogCity;
