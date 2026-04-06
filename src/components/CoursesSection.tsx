import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const courses = [
  {
    title: "UPSC Preparation",
    description: "Complete Civil Services preparation with expert mentorship and mock tests.",
    color: "from-primary to-primary/80",
  },
  {
    title: "SSC Coaching",
    description: "Comprehensive SSC CGL, CHSL & MTS preparation with topic-wise coverage.",
    color: "from-secondary to-secondary/80",
  },
  {
    title: "Banking Exams",
    description: "IBPS PO, SBI, RBI and all banking exam preparation with practice sets.",
    color: "from-primary to-primary/80",
  },
  {
    title: "School Tuitions",
    description: "Class 6-12 CBSE, ICSE & State Board tuitions with personalized attention.",
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
                <Button variant="ghost" className="text-primary font-semibold p-0 h-auto hover:bg-transparent hover:text-secondary group-hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
