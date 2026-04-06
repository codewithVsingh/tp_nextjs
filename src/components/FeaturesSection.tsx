import { motion } from "framer-motion";
import { Target, BarChart3, BookOpen, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Expert Tutors",
    description: "Learn from India's top educators with proven track records in competitive exam coaching.",
  },
  {
    icon: BarChart3,
    title: "Personalized Learning Plans",
    description: "AI-powered study plans tailored to your strengths, weaknesses, and goals.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Courses",
    description: "From school tuitions to UPSC — structured courses covering every syllabus.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "95% of our students achieve their target scores with consistent improvement.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
