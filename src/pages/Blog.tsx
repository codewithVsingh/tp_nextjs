import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const posts = [
  {
    title: "Top 10 Tips to Crack UPSC in Your First Attempt",
    excerpt: "Learn proven strategies from UPSC toppers and our expert mentors to maximize your preparation efficiency.",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "UPSC",
  },
  {
    title: "How Personalized Learning Plans Boost Exam Scores by 40%",
    excerpt: "Discover the science behind personalized education and how Tutors Parliament uses AI to tailor learning paths.",
    date: "March 8, 2024",
    readTime: "6 min read",
    category: "Learning",
  },
  {
    title: "Banking Exam 2024: Complete Preparation Guide",
    excerpt: "A comprehensive roadmap covering IBPS PO, SBI, and RBI exam preparation with subject-wise strategies.",
    date: "February 28, 2024",
    readTime: "10 min read",
    category: "Banking",
  },
  {
    title: "Why Online Tutoring is the Future of Education in India",
    excerpt: "Explore how online tutoring platforms are breaking geographical barriers and making quality education accessible.",
    date: "February 20, 2024",
    readTime: "5 min read",
    category: "Education",
  },
  {
    title: "SSC CGL 2024: Subject-Wise Strategy & Booklist",
    excerpt: "Expert-recommended books and strategies for each section of the SSC CGL exam to help you score 200+.",
    date: "February 12, 2024",
    readTime: "7 min read",
    category: "SSC",
  },
  {
    title: "5 Study Habits of Toppers That You Can Adopt Today",
    excerpt: "Research-backed study techniques used by top rankers across competitive exams. Start implementing them now.",
    date: "February 5, 2024",
    readTime: "4 min read",
    category: "Tips",
  },
];

const Blog = () => {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-24 pb-16 section-padding" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground mb-4">
                Blog & <span className="text-secondary">Resources</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Expert tips, exam strategies, and education insights to help you stay ahead in your preparation journey.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-background rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="h-48 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center p-6">
                    <span className="bg-secondary/20 text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full border border-secondary/30 absolute top-4 left-4">
                      {post.category}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-primary-foreground text-center leading-snug">
                      {post.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                    <Button variant="ghost" className="text-primary font-semibold p-0 h-auto hover:bg-transparent hover:text-secondary group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Blog;
