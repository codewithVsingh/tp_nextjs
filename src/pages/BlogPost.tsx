import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, Download, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BlogReadingProgress from "@/components/BlogReadingProgress";
import BlogCTA from "@/components/BlogCTA";
import BlogSocialShare from "@/components/BlogSocialShare";
import { getPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { toast } from "@/hooks/use-toast";

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
            <Link to="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleEmailCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Thank you!", description: "Your free study plan will be sent to your email shortly." });
    setEmail("");
  };

  return (
    <>
      <BlogReadingProgress />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-12 section-padding" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto max-w-4xl">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="text-primary-foreground/60 hover:text-primary-foreground">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-primary-foreground/40" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/blog" className="text-primary-foreground/60 hover:text-primary-foreground">Blog</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-primary-foreground/40" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-primary-foreground/80 truncate max-w-[200px]">{post.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-primary-foreground/70 text-lg mb-6">{post.metaDescription}</p>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/60 flex-wrap">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
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
            <img src={post.heroImage} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
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
              <motion.div
                key={i}
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
            ))}
          </div>

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
                <p className="text-muted-foreground text-sm">Get a personalized study plan template designed for Delhi students. Enter your email below.</p>
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

          {/* Blog CTA */}
          <BlogCTA />

          {/* Related Blogs */}
          <section className="mt-16">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.slug}`}
                  className="group rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={rp.heroImage}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
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
            <Link to="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to All Articles
              </Button>
            </Link>
          </div>
        </article>

        {/* Sticky CTA */}
        <div className="fixed bottom-6 right-6 z-50 hidden md:block">
          <Button variant="cta" size="lg" className="rounded-full shadow-xl gap-2" asChild>
            <Link to="/demo-booking"><Calendar className="w-5 h-5" /> Start Free Demo</Link>
          </Button>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BlogPost;
