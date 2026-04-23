"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Home Tuition Questions",
    icon: "🏠",
    faqs: [
      {
        question: "How do I find the best home tutor in Delhi?",
        answer:
          "At Tutors Parliament, we match you with verified, experienced home tutors based on your child's class, board (CBSE/ICSE/State), subject needs, and location within Delhi NCR. Simply book a free demo class and we'll connect you with the most suitable tutor — no commitment required.",
      },
      {
        question: "Are demo classes available before enrolling?",
        answer:
          "Yes! We offer a completely free demo class so you can experience the teaching quality firsthand. There's zero obligation — if you're not satisfied, you can choose a different tutor or simply walk away. Most parents in Delhi find their ideal tutor within the first demo itself.",
      },
      {
        question: "What subjects do your tutors cover?",
        answer:
          "Our tutors cover all major subjects including Mathematics, Science (Physics, Chemistry, Biology), English, Hindi, Social Studies, Computer Science, Accountancy, Economics, and more. We also offer specialized coaching for competitive exams like JEE, NEET, and Olympiads.",
      },
      {
        question: "Do you provide tutors for all areas in Delhi NCR?",
        answer:
          "Yes, we serve all major areas across Delhi NCR including South Delhi, North Delhi, East Delhi, West Delhi, Noida, Gurgaon, Faridabad, and Ghaziabad. For remote locations, we also offer high-quality online tuition as an alternative.",
      },
    ],
  },
  {
    title: "Online Classes",
    icon: "💻",
    faqs: [
      {
        question: "How do online classes work at Tutors Parliament?",
        answer:
          "Our online classes are conducted via live video sessions using platforms like Zoom or Google Meet. Each session is interactive with screen sharing, digital whiteboard, and real-time doubt solving. Students get the same personalized attention as offline tuition.",
      },
      {
        question: "Are online classes recorded for later review?",
        answer:
          "Yes, all online sessions can be recorded upon request. Students can revisit the recordings anytime to revise concepts, which is especially helpful before exams. This is a popular feature among Delhi students preparing for board exams.",
      },
      {
        question: "What platform is used for online tuition?",
        answer:
          "We primarily use Zoom and Google Meet for online classes, along with digital tools like Miro whiteboards and shared Google Docs for assignments. The platform is chosen based on what works best for the student's device and internet connectivity.",
      },
      {
        question: "Is online tuition as effective as home tuition?",
        answer:
          "Absolutely. Our data shows that students in online tuition perform equally well, with many scoring 90%+ in board exams. The key is personalized 1-on-1 attention, which remains the same whether online or offline. Many Delhi families now prefer online classes for convenience and safety.",
      },
    ],
  },
  {
    title: "Counselling Questions",
    icon: "🧠",
    faqs: [
      {
        question: "What is student counselling and who needs it?",
        answer:
          "Student counselling helps young learners navigate academic challenges, career confusion, exam stress, and personal issues. It's ideal for students in Class 8–12 in Delhi who are unsure about stream selection, career paths, or struggling with academic pressure.",
      },
      {
        question: "How do I book a counselling session?",
        answer:
          "Booking is simple: choose your counselling type (Student, Parent, or Personal), select an available counsellor, pick a time slot, and confirm. You can book directly through our website or call us. First consultations are often free or discounted.",
      },
      {
        question: "Is counselling confidential?",
        answer:
          "100% confidential. All sessions follow strict privacy protocols. Nothing discussed during counselling is shared with anyone — including parents (for student sessions) — unless the student gives explicit consent or there's a safety concern.",
      },
      {
        question: "Do you offer parent counselling as well?",
        answer:
          "Yes, we offer dedicated parent counselling to help parents understand their child's academic needs, manage expectations, improve communication, and support their child's growth without adding pressure. It's especially popular among Delhi NCR families.",
      },
    ],
  },
  {
    title: "Pricing & Payments",
    icon: "💰",
    faqs: [
      {
        question: "What are the tuition fees at Tutors Parliament?",
        answer:
          "Fees vary based on the class level, subject, and mode (online/offline). For Delhi home tuition, fees typically range from ₹500–₹1500 per hour depending on the tutor's experience and subject complexity. Contact us for a customized quote.",
      },
      {
        question: "Are there monthly plans available?",
        answer:
          "Yes, we offer flexible monthly plans with no long-term lock-in. You can choose the number of classes per week and pay monthly. We also offer discounted packages for 3-month and 6-month commitments.",
      },
      {
        question: "Is there a refund policy?",
        answer:
          "Yes. If you're not satisfied with the tutor after the first paid session, we'll either assign a new tutor at no extra cost or provide a full refund for unused sessions. Your satisfaction and your child's learning progress are our top priorities.",
      },
      {
        question: "Are there any hidden charges?",
        answer:
          "No hidden charges at all. The fee quoted is the fee you pay. There are no registration fees, material charges, or platform fees. We believe in complete transparency — what you see is what you get.",
      },
    ],
  },
];

const FAQ = () => (
  <>
    <SEOHead
      title="FAQs — Home Tuition, Online Classes & Counselling | Tutors Parliament"
      description="Answers to common questions about home tutors, online classes, and student/parent counselling across India. Trusted by 10,000+ students."
      canonical="https://tutorsparliament.com/faq"
    />
    <Navbar />
    <main className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-accent/30">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Got Questions?
            </span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mt-3 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything parents and students usually ask before getting started with Tutors Parliament in Delhi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl space-y-12">
          {faqCategories.map((category, catIdx) => (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h2 className="font-heading font-bold text-2xl text-foreground mb-5 flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`cat-${catIdx}-faq-${i}`}
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to help. Reach out via WhatsApp or book a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#contact" className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-8 py-3 font-semibold hover:opacity-90 transition-opacity">
              Contact Us
            </a>
            <a href="/demo-booking" className="inline-flex items-center justify-center rounded-xl border border-border bg-background text-foreground px-8 py-3 font-semibold hover:bg-accent transition-colors">
              Start Free Demo
            </a>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default FAQ;