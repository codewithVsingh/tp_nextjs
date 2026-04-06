import { motion } from "framer-motion";
import { CalendarCheck, Users, BookOpen, BarChart3 } from "lucide-react";

const steps = [
  { icon: CalendarCheck, title: "Book Demo", description: "Schedule a free consultation with our team." },
  { icon: Users, title: "Get Matched", description: "We pair you with the perfect tutor for your goals." },
  { icon: BookOpen, title: "Start Learning", description: "Begin your personalized learning journey." },
  { icon: BarChart3, title: "Track Progress", description: "Monitor improvements with detailed analytics." },
];

const HowItWorks = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
            Your Journey to <span className="text-primary">Success</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-5 flex items-center justify-center relative">
                <step.icon className="w-8 h-8 text-primary-foreground" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
