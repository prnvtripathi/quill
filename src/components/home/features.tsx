"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pencil,
  LayoutList,
  Sparkles,
  Clock,
  Lock,
  SlidersHorizontal,
} from "lucide-react";

const features = [
  {
    title: "Distraction-Free Editor",
    description:
      "A clean, minimalist workspace that lets your thoughts flow uninterrupted.",
    icon: Pencil,
  },
  {
    title: "Smart Organization",
    description:
      "Tag, group, and organize your notes effortlessly to stay in control.",
    icon: LayoutList,
  },
  {
    title: "AI-Powered Suggestions",
    description:
      "Get helpful nudges—summaries, todos, and insights—while you write.",
    icon: Sparkles,
  },
  {
    title: "Time-Saving Templates",
    description:
      "Kickstart your notes with simple, reusable structure templates.",
    icon: SlidersHorizontal,
  },
  {
    title: "Session Tracking",
    description:
      "Log your writing sessions to stay consistent and track your focus time.",
    icon: Clock,
  },
  {
    title: "Private & Secure",
    description:
      "All your notes are encrypted and stored locally or in your private cloud.",
    icon: Lock,
  },
];

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    icon: React.ElementType;
  };
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="border-0 shadow-sm dark:bg-slate-900 h-full">
        <CardContent className="p-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="mb-4 text-primary"
          >
            <feature.icon size={24} />
          </motion.div>
          <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container px-4 max-w-6xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl font-medium mb-3 text-slate-900 dark:text-white">
            Built for Focused Note-Taking
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Our features are designed to help you write better, stay organized,
            and keep your thoughts flowing—all without distractions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
