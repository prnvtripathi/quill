"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });

  const staggerDelay = 0.1;

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "Github" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const productLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#" },
    { name: "Use Cases", href: "#" },
    { name: "Security", href: "#" },
  ];

  const companyLinks = [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const legalLinks = [
    { name: "Terms", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Cookies", href: "#" },
  ];

  return (
    <footer
      ref={footerRef}
      className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black"
    >
      <div className="container px-4 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/" className="inline-block mb-4">
              <motion.span
                className="text-xl font-medium text-primary"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                quill
              </motion.span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-sm text-sm">
              A quiet space to write, reflect, and stay organized. Built for
              clarity, flow, and peace of mind.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{
                    duration: 0.3,
                    delay: staggerDelay * index,
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <Link
                    href={social.href}
                    className="text-slate-500 hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <social.icon size={18} />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: staggerDelay }}
          >
            <h3 className="font-medium mb-3 text-base">Product</h3>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                  }
                  transition={{
                    duration: 0.3,
                    delay: staggerDelay + index * 0.05,
                  }}
                >
                  <Link
                    href={link.href}
                    className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: staggerDelay * 2 }}
          >
            <h3 className="font-medium mb-3 text-base">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                  }
                  transition={{
                    duration: 0.3,
                    delay: staggerDelay * 2 + index * 0.05,
                  }}
                >
                  <Link
                    href={link.href}
                    className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: staggerDelay * 3 }}
        >
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            &copy; {year} Notely. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {legalLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-500 dark:text-slate-400 hover:text-primary text-xs transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
