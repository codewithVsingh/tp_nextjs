import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const tutors = [
  { name: "Dr. Priya Sharma", expertise: "UPSC & Political Science", experience: "15+ Years", initials: "PS" },
  { name: "Rajesh Kumar", expertise: "Mathematics & Banking", experience: "12+ Years", initials: "RK" },
  { name: "Anita Desai", expertise: "English & SSC", experience: "10+ Years", initials: "AD" },
  { name: "Vikram Singh", expertise: "Science & School Board", experience: "8+ Years", initials: "VS" },
];

const TutorsSection = () => {
  return (
    <section id="tutors" className="section-padding section-alt">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Tutors</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
            Learn from the <span className="text-primary">Best Educators</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">{tutor.initials}</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{tutor.name}</h3>
              <p className="text-primary text-sm font-medium mt-1">{tutor.expertise}</p>
              <p className="text-muted-foreground text-sm mt-1">{tutor.experience}</p>
              <Button variant="outline" className="mt-4 w-full">
                View Profile
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorsSection;
