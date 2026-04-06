import { motion } from "framer-motion";
import { Star, Users, Award, BookOpen } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Students Trained" },
  { icon: Star, value: "4.9/5", label: "Student Rating" },
  { icon: Award, value: "500+", label: "Expert Tutors" },
  { icon: BookOpen, value: "50+", label: "Courses Available" },
];

const TrustBar = () => {
  return (
    <section className="relative z-10 -mt-8">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-2xl card-shadow p-6 md:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-bold text-xl text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
