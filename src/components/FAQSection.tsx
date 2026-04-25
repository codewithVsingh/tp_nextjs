import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQ[];
  className?: string;
}

const FAQSection = ({ title = "Frequently Asked Questions", subtitle, faqs, className }: FAQSectionProps) => (
  <section className={`section-padding ${className || ""}`}>
    <div className="container mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        {subtitle && (
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">{subtitle}</span>
        )}
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">{title}</h2>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="bg-background rounded-xl px-6 border border-border card-shadow"
          >
            <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;

