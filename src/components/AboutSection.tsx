import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const points = [
  "Personalized mentorship from top educators",
  "Structured programs for every competitive exam",
  "Measurable outcomes and progress tracking",
  "Flexible scheduling to fit your routine",
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2 mb-6">
              More Than Just Coaching —{" "}
              <span className="text-primary">We Build Futures.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Tutors Parliament is a learning ecosystem designed to help students excel through
              personalized mentorship, structured programs, and measurable outcomes. We connect
              students with India's best educators to unlock their true potential.
            </p>
            <ul className="space-y-4">
              {points.map((point, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-foreground font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-accent rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "10,000+", label: "Students" },
                  { value: "95%", label: "Success Rate" },
                  { value: "500+", label: "Expert Tutors" },
                  { value: "50+", label: "Courses" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="font-heading font-extrabold text-3xl md:text-4xl text-primary">{stat.value}</p>
                    <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
