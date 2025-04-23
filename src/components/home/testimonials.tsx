"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  message: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Leah Kim",
    role: "Freelance Writer",
    message:
      "This app helps me stay focused and organized while writing articles. The clean design clears my mind.",
    rating: 5,
  },
  {
    name: "Daniel Ortiz",
    role: "PhD Candidate",
    message:
      "I use it to take structured notes during research sessions. The minimalist UI keeps distractions away.",
    rating: 5,
  },
  {
    name: "Priya Desai",
    role: "Journal Enthusiast",
    message:
      "Writing in here feels calming. It's become part of my daily reflection routine. Just enough features, never too much.",
    rating: 4,
  },
];

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -5 }}
    >
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-slate-900 h-full overflow-hidden">
        <CardContent className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
            className="flex mb-4"
          >
            {Array(testimonial.rating)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.15 + 0.2 + i * 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <Star
                    size={16}
                    className="text-yellow-400 fill-yellow-400 mr-1"
                  />
                </motion.div>
              ))}
          </motion.div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 italic">
            "{testimonial.message}"
          </p>
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3 text-sm"
            >
              {testimonial.name.charAt(0)}
            </motion.div>
            <div>
              <h4 className="font-medium text-base">{testimonial.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {testimonial.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-black">
      <div className="container px-4 max-w-5xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-medium mb-3">Writers Love the Flow</h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Whether you're jotting down a fleeting thought or outlining your
            thesis, people trust this space to keep them present, focused, and
            inspired.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
