import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          style={{ background: "var(--hero-gradient)" }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4">
            Start Your Learning Journey Today
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of successful students. Start your free demo and see the difference expert tutoring makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-base px-10 py-6" onClick={() => navigate("/demo-booking")}>
              Start Free Demo <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 text-base font-medium"
              asChild
            >
              <a href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20book%20a%20free%20demo%20class" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
