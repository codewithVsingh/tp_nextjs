import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    title: "CBSE Tuition",
    description: "Structured learning aligned with NCERT curriculum for Class 1-12. Expert Delhi-based tutors for every subject.",
    color: "from-primary to-primary/80",
  },
  {
    title: "ICSE Coaching",
    description: "Concept clarity with detailed subject depth. Comprehensive ICSE/ISC preparation with application-based learning.",
    color: "from-secondary to-secondary/80",
  },
  {
    title: "State Boards",
    description: "Region-specific syllabus expertise for Delhi, UP, Haryana and other state boards with experienced tutors.",
    color: "from-primary to-primary/80",
  },
  {
    title: "JEE / NEET Prep",
    description: "Competitive exam preparation with mock tests, problem-solving sessions, and personalized mentorship.",
    color: "from-secondary to-secondary/80",
  },
];

const CoursesSection = () => {
  return (
    <section id="courses" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Courses</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
            Programs Designed for <span className="text-primary">Your Success</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Online & Offline tuition classes across Delhi NCR for all boards and competitive exams</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`h-40 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                <h3 className="font-heading font-bold text-xl text-primary-foreground text-center px-4">
                  {course.title}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{course.description}</p>
                <Link href="/courses">
                  <Button variant="ghost" className="text-primary font-semibold p-0 h-auto hover:bg-transparent hover:text-secondary group-hover:gap-3 transition-all">
                    Explore Courses <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
