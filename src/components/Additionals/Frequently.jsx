"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

// Edit this array with your own EventFlow FAQ content
const faqs = [
  {
    question: "How do I book a ticket on EventFlow?",
    answer:
      "Search for your event, pick your preferred seats or ticket tier, and check out securely. Your e-ticket lands in your email and your EventFlow account instantly — no printing required.",
  },
  {
    question: "Can I get a refund if I cancel my booking?",
    answer:
      "Yes. Refund eligibility depends on the event organizer's policy, shown on the event page before you book. Eligible refunds are processed back to your original payment method within 5–7 business days.",
  },
  {
    question: "What happens if an event is postponed or cancelled?",
    answer:
      "You'll get an email and in-app notification right away. For cancelled events, tickets are automatically refunded. For postponed events, your ticket stays valid for the new date unless you request a refund.",
  },
  {
    question: "Is my payment information safe with EventFlow?",
    answer:
      "Absolutely. We never store your card details on our servers — all payments are processed through PCI-DSS compliant providers with end-to-end encryption.",
  },
  {
    question: "Can I transfer my ticket to someone else?",
    answer:
      "Yes, most tickets can be transferred from the 'My Tickets' section of your account. The recipient will get a new e-ticket under their name, and your original ticket will be deactivated.",
  },
  {
    question: "Do I need to print my ticket?",
    answer:
      "No. Every ticket comes with a scannable QR code that works straight from your phone. Just show it at the entry gate for a quick, contactless check-in.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-indigo-100 bg-white/60 backdrop-blur-xl transition-all duration-300 hover:border-indigo-300 hover:shadow-md dark:border-indigo-500/20 dark:bg-slate-800/40 dark:hover:border-indigo-400 dark:shadow-none"
    >
      {/* Subtle gradient wash, brighter when open */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-slate-400/5 to-slate-300/5 transition-opacity duration-500 dark:from-indigo-500/10 dark:via-slate-400/10 dark:to-slate-300/10 ${
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      <button
        onClick={onClick}
        className="relative flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-6 sm:py-5"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm font-medium transition-colors duration-300 sm:text-base md:text-lg ${
            isOpen
              ? "text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-200"
          }`}
        >
          {faq.question}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 sm:h-8 sm:w-8 ${
            isOpen
              ? "border-indigo-300 bg-indigo-100 text-indigo-600 dark:border-indigo-400/50 dark:bg-indigo-900/50 dark:text-indigo-300"
              : "border-indigo-100 bg-white/50 text-slate-400 dark:border-indigo-500/30 dark:bg-slate-700/50 dark:text-slate-400"
          }`}
        >
          <Plus size={14} strokeWidth={2.5} className="sm:hidden" />
          <Plus size={16} strokeWidth={2.5} className="hidden sm:block" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pb-5 sm:text-[15px] dark:text-slate-300/80 transition-colors duration-300">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Frequently() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950 dark:to-slate-900 px-4 py-16 sm:px-6 sm:py-20 md:py-24 transition-colors duration-500">
      
      {/* Ambient background glow, consistent with the rest of the site */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-60 -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-300/40 blur-[80px] sm:h-80 sm:w-125 sm:blur-[100px] md:h-125 md:w-175 md:blur-[120px] dark:bg-indigo-600/20" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 translate-x-1/3 translate-y-1/3 rounded-full bg-slate-400/30 blur-[60px] sm:h-64 sm:w-64 sm:blur-[80px] md:h-100 md:w-100 md:blur-[100px] dark:bg-slate-700/20" />

      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center sm:mb-14"
        >
          <span className="mb-3 inline-block rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-medium uppercase tracking-wider text-indigo-700 backdrop-blur-md dark:border-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-300 transition-colors duration-500">
            FAQ
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-white transition-colors duration-500">
            Got questions?{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-slate-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-indigo-300 dark:to-slate-300">
              We have got answers.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 sm:text-base dark:text-slate-300/70 transition-colors duration-500">
            Everything you need to know about booking, refunds, and getting into
            your next event with EventFlow.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-3 sm:gap-4"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}