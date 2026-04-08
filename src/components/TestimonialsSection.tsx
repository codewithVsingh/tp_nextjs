import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

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
  {
    name: "Divya Iyer",
    result: "NEET — AIR 320",
    text: "The biology sessions were incredibly detailed. My tutor's exam strategies helped me score way beyond my expectations.",
    initials: "DI",
  },
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
            What Our <span className="text-primary">Students Say</span>
          </h2>
        </motion.div>

        <div className="relative group">
          {/* Arrows */}
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

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="min-w-0 shrink-0 grow-0 pl-6 basis-full md:basis-1/2 transition-all duration-500"
                >
                  <div
                    className={`bg-background rounded-2xl p-6 md:p-8 card-shadow hover:card-shadow-hover transition-all duration-300 relative ${
                      selectedIndex === i ? "scale-[1.02] shadow-lg" : "scale-100"
                    }`}
                  >
                    <Quote className="w-8 h-8 text-accent absolute top-6 right-6 opacity-40" />
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
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
