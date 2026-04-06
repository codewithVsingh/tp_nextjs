import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sneha Patel",
    result: "AIR 45 — UPSC CSE 2024",
    text: "Tutors Parliament transformed my preparation. The mentorship was unmatched and helped me crack UPSC in my first attempt.",
    initials: "SP",
  },
  {
    name: "Arjun Mehta",
    result: "SBI PO — Selected 2024",
    text: "The structured approach and mock tests gave me the confidence I needed. Best investment in my career.",
    initials: "AM",
  },
  {
    name: "Kavita Reddy",
    result: "Class 12 — 98.5%",
    text: "My tutor understood my learning pace perfectly. I went from struggling in maths to scoring 99 in boards!",
    initials: "KR",
  },
  {
    name: "Rahul Nair",
    result: "SSC CGL — Rank 112",
    text: "The personalized study plan and constant doubt-clearing sessions made all the difference. Highly recommended!",
    initials: "RN",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
            What Our <span className="text-primary">Students Say</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background rounded-2xl p-6 md:p-8 card-shadow hover:card-shadow-hover transition-shadow duration-300 relative"
            >
              <Quote className="w-8 h-8 text-accent absolute top-6 right-6" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold">{t.initials}</span>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">{t.name}</h4>
                  <p className="text-secondary text-sm font-medium">{t.result}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{t.text}</p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
