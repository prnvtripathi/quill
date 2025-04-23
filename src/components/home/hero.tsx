"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, NotebookPen, PencilLine } from "lucide-react";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import Link from "next/link";

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} className="pt-20 pb-10 md:pt-28 md:pb-16">
      <div className="px-4 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            className="space-y-5 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
              Take Notes{" "}
              <ContainerTextFlip
                className="inline-block"
                words={["Effortlessly", "Easily", "Quickly"]}
              />{" "}
              Every Time
            </h1>
            <motion.p
              className="text-lg text-slate-600 dark:text-slate-300 md:text-xl"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A distraction-free, streamlined note-taking app built for deep
              work. Capture your thoughts, ideas, and insights with clarity and
              speed.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/notes">
                  <Button size="lg" className="font-medium px-6" asChild>
                    <div className="flex items-center">
                      Start Writing <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="youtube.com" target="_blank">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-medium px-6"
                    asChild
                  >
                    <div>Try a Live Demo</div>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative w-full max-w-4xl mt-8"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-primary/10 rounded-xl -m-1 backdrop-blur-sm">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <motion.div
              className="relative bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
              animate={{
                y: [0, -16, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
            >
              <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <NotebookPen size={18} className="text-primary mr-2" />
                  <span className="font-medium text-sm">
                    focus_session_notes.md
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Auto-saved
                </span>
              </div>

              <div className="p-5 space-y-4">
                <motion.div
                  className="text-left text-sm bg-primary/10 rounded-lg p-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <p className="font-medium">🌱 Morning Brain Dump</p>
                  <p className="text-sm mt-1">
                    - Idea: Reduce context switching in writing sessions.
                    <br />
                    - Quote: “Clarity is the elimination of noise.”
                    <br />- Priority: Try 25-minute block timers with note
                    summaries.
                  </p>
                </motion.div>

                <motion.div
                  className="text-left text-sm bg-secondary/80 rounded-lg p-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.4, delay: 1 }}
                >
                  <p className="font-medium">✨ Smart Suggestions</p>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                    <li>Turn this into a task list</li>
                    <li>Highlight the quote</li>
                    <li>Add a tag: #focus</li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
