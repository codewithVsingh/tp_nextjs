import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

const testimonials = [
  // Student testimonials
  { name: "Sneha P.", result: "Class 10 — 96.4% (CBSE)", text: "Tutors Parliament completely changed how I approached my board exams. My maths tutor in Delhi made every concept crystal clear. I went from 75% to 96% in just 6 months!", initials: "SP", type: "student", verified: true },
  { name: "Arjun M.", result: "Class 12 — 94% (Science)", text: "The personalized study plan and weekly mock tests helped me score consistently in Physics and Chemistry. Best tuition in Delhi for serious students.", initials: "AM", type: "student", verified: true },
  { name: "Kavita R.", result: "Class 10 — 98.5% (ICSE)", text: "My tutor understood my learning pace perfectly. I went from struggling in maths to scoring 99 in boards! The ICSE coaching was exceptional.", initials: "KR", type: "student", verified: true },
  { name: "Rahul N.", result: "Class 9 — Topped Section", text: "The daily routine my tutor helped me create was a game-changer. In Delhi's competitive schools, having a structured approach made all the difference.", initials: "RN", type: "student", verified: true },
  { name: "Divya I.", result: "NEET — AIR 320", text: "The biology sessions were incredibly detailed. My tutor's exam strategies helped me score way beyond my expectations. Best NEET coaching support in Delhi.", initials: "DI", type: "student", verified: true },
  { name: "Aisha K.", result: "Class 8 — School Topper", text: "I used to hate Science but my tutor made it so interesting with real-life examples. Now it's my favourite subject! Thank you Tutors Parliament!", initials: "AK", type: "student", verified: true },
  { name: "Rohan S.", result: "JEE Mains — 99.2%ile", text: "Started JEE preparation in Class 11 with Tutors Parliament. The Physics and Maths coaching was at par with top coaching institutes in Delhi.", initials: "RS", type: "student", verified: true },
  { name: "Priya D.", result: "Class 12 — 97% (Commerce)", text: "Accountancy felt impossible until I found my tutor here. She explained every concept with patience. Best commerce tuition in Delhi NCR!", initials: "PD", type: "student", verified: true },
  { name: "Vikash T.", result: "Class 6 — Improved 40%", text: "My son was very weak in English and Hindi. The home tutor from Tutors Parliament helped him improve dramatically. Highly recommend for Delhi parents.", initials: "VT", type: "parent", verified: true },
  { name: "Meena G.", result: "Parent — Class 4 Student", text: "Finding a good tutor for young kids in Delhi is so hard. Tutors Parliament matched us with the perfect teacher. My daughter actually looks forward to study time now.", initials: "MG", type: "parent", verified: true },
  { name: "Sanjay K.", result: "Parent — Class 11 Student", text: "The parent counselling session helped me understand how to support my son during his JEE preparation without adding pressure. Truly grateful.", initials: "SK", type: "parent", verified: true },
  { name: "Anjali B.", result: "Class 10 — 91% (State Board)", text: "I switched from another coaching centre to Tutors Parliament and the difference was night and day. Personalised attention really matters.", initials: "AB", type: "student", verified: true },
];

const TestimonialsSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

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
            What Our <span className="text-primary">Students & Parents Say</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Real reviews from students and families across Delhi NCR</p>
        </motion.div>

        <div className="relative group">
          <button
            onClick={scrollPrev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background card-shadow flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background card-shadow flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6">
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 pl-6 basis-full md:basis-1/2 transition-all duration-500">
                  <div className={`bg-background rounded-2xl p-6 md:p-8 card-shadow hover:card-shadow-hover transition-all duration-300 relative ${selectedIndex === i ? "scale-[1.02] shadow-lg" : "scale-100"}`}>
                    <Quote className="w-8 h-8 text-accent absolute top-6 right-6 opacity-40" />
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${t.type === "parent" ? "bg-secondary" : "bg-primary"}`}>
                        <span className="text-primary-foreground font-bold">{t.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-foreground">{t.name}</h4>
                        <p className="text-secondary text-sm font-medium">{t.result}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">{t.text}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                        ))}
                      </div>
                      {t.verified && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified Google Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === selectedIndex ? "bg-primary w-6" : "bg-muted-foreground/30"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
