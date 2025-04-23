"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950" id="contact">
      <div className="container px-4 max-w-5xl mx-auto">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
          }
          transition={{ duration: 0.6 }}
          className="rounded-xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 p-8 md:p-10 text-center text-white shadow-lg overflow-hidden relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              Make Space for Quiet Thinking
            </h2>
            <p className="text-base mb-8 max-w-xl mx-auto text-white/90">
              Start fresh with a peaceful workspace built to capture your
              thoughts, not distract from them.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                }
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-slate-800 hover:bg-white/90 hover:text-slate-900 font-medium px-6"
                >
                  <Link href="/signup">
                    Try It Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                }
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-medium px-6"
                >
                  <Link href="https://cal.com/prnvtripathi/intro">
                    Let’s Talk
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-white/10"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/5"></div>
            <div className="absolute top-1/2 right-1/4 w-10 h-10 rounded-full bg-white/10"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
