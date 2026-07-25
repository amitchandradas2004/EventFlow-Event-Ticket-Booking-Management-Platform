// "use client";

// import { motion } from "framer-motion";
// import { Search, Armchair, CreditCard, QrCode } from "lucide-react";

// // Edit this array to change steps, icons, or copy
// const steps = [
//   {
//     icon: Search,
//     step: "01",
//     title: "Find your event",
//     description:
//       "Search by artist, venue, or city — or browse curated categories to discover what's happening near you.",
//   },
//   {
//     icon: Armchair,
//     step: "02",
//     title: "Pick your seats",
//     description:
//       "Choose your preferred seating tier or general admission spot from a live, interactive seat map.",
//   },
//   {
//     icon: CreditCard,
//     step: "03",
//     title: "Pay securely",
//     description:
//       "Checkout in seconds with encrypted, PCI-DSS compliant payments — no card details ever stored on our end.",
//   },
//   {
//     icon: QrCode,
//     step: "04",
//     title: "Get your e-ticket",
//     description:
//       "Your QR-coded ticket lands instantly in your email and EventFlow account. Just scan and walk in.",
//   },
// ];

// const containerVariants = {
//   hidden: {},
//   visible: {
//     transition: {
//       staggerChildren: 0.12,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 24 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
//   },
// };

// function StepCard({ icon: Icon, step, title, description, isLast }) {
//   return (
//     <motion.div variants={itemVariants} className="relative flex-1">
//       {/* connecting line — hidden on mobile, shown from sm up, hidden on last item */}
//       {!isLast && (
//         <div className="pointer-events-none absolute left-1/2 top-8 hidden h-px w-full -translate-y-1/2 bg-linear-to-r from-gray-300 to-transparent sm:block md:top-9 dark:from-white/15" />
//       )}

//       <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
//         {/* icon circle */}
//         <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm sm:h-18 sm:w-18 md:h-20 md:w-20 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
//           <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/5 via-slate-400/5 to-slate-300/5 dark:from-indigo-500/10 dark:via-slate-400/10 dark:to-slate-300/10" />
//           <Icon
//             size={24}
//             strokeWidth={1.75}
//             className="relative text-indigo-600 sm:h-7 sm:w-7 dark:text-indigo-300"
//           />
//           <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-500 sm:-right-2.5 sm:-top-2.5 dark:border-white/10 dark:bg-gray-700 dark:text-white/50">
//             {step}
//           </span>
//         </div>

//         <h3 className="mt-4 text-base font-semibold text-gray-900 sm:mt-5 sm:text-lg dark:text-white">
//           {title}
//         </h3>
//         <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-gray-500 sm:max-w-none sm:text-[15px] dark:text-white/60">
//           {description}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// export default function HowItWorks() {
//   return (
//     <section className="relative w-full overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 dark:bg-[#0b0b12]">
//       {/* ambient background glow, consistent with rest of the page */}
//       <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-60 -translate-x-1/2 -translate-y-1/3 rounded-full bg-slate-500/10 blur-[80px] sm:h-80 sm:w-125 sm:blur-[100px] md:h-125 md:w-175 md:blur-[120px] dark:bg-slate-500/20" />
//       <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-600/5 blur-[60px] sm:h-64 sm:w-64 sm:blur-[80px] md:h-100 md:w-100 md:blur-[100px] dark:bg-indigo-600/10" />

//       <div className="relative mx-auto max-w-6xl">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-80px" }}
//           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           className="mb-12 text-center sm:mb-16"
//         >
//           <span className="mb-3 inline-block rounded-full border border-gray-200 bg-gray-50 px-4 py-1 text-xs font-medium uppercase tracking-wider text-gray-500 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/50">
//             How it works
//           </span>
//           <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
//             From search to seat{" "}
//             <span className="bg-linear-to-r from-slate-500 via-indigo-500 to-indigo-400 bg-clip-text text-transparent dark:from-slate-300 dark:via-indigo-300 dark:to-indigo-200">
//               in four easy steps.
//             </span>
//           </h2>
//           <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 sm:text-base dark:text-white/50">
//             Booking your next event with EventFlow takes less than two minutes,
//             start to finish.
//           </p>
//         </motion.div>

//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-60px" }}
//           className="flex flex-col gap-10 sm:flex-row sm:gap-6 md:gap-8"
//         >
//           {steps.map((s, index) => (
//             <StepCard key={s.step} {...s} isLast={index === steps.length - 1} />
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { Search, Armchair, CreditCard, QrCode } from "lucide-react";

// Edit this array to change steps, icons, or copy
const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find your event",
    description:
      "Search by artist, venue, or city — or browse curated categories to discover what's happening near you.",
  },
  {
    icon: Armchair,
    step: "02",
    title: "Pick your seats",
    description:
      "Choose your preferred seating tier or general admission spot from a live, interactive seat map.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Pay securely",
    description:
      "Checkout in seconds with encrypted, PCI-DSS compliant payments — no card details ever stored on our end.",
  },
  {
    icon: QrCode,
    step: "04",
    title: "Get your e-ticket",
    description:
      "Your QR-coded ticket lands instantly in your email and EventFlow account. Just scan and walk in.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function StepCard({ icon: Icon, step, title, description, isLast }) {
  return (
    <motion.div variants={itemVariants} className="relative flex-1">
      {/* connecting line — hidden on mobile, shown from sm up, hidden on last item */}
      {!isLast && (
        <div className="pointer-events-none absolute left-1/2 top-8 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-indigo-200 to-transparent sm:block md:top-9 dark:from-indigo-500/30" />
      )}

      <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
        {/* icon circle */}
        <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-white shadow-sm sm:h-18 sm:w-18 md:h-20 md:w-20 dark:border-indigo-500/20 dark:bg-slate-800/80 dark:backdrop-blur-sm dark:shadow-none transition-colors duration-500">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-slate-400/5 to-slate-300/5 dark:from-indigo-500/10 dark:via-slate-400/10 dark:to-slate-300/10" />
          <Icon
            size={24}
            strokeWidth={1.75}
            className="relative text-indigo-600 sm:h-7 sm:w-7 dark:text-indigo-400"
          />
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-[10px] font-semibold text-indigo-600 sm:-right-2.5 sm:-top-2.5 dark:border-indigo-500/30 dark:bg-slate-700 dark:text-indigo-200 transition-colors duration-500">
            {step}
          </span>
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 sm:mt-5 sm:text-lg dark:text-white transition-colors duration-500">
          {title}
        </h3>
        <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-slate-600 sm:max-w-none sm:text-[15px] dark:text-slate-300/80 transition-colors duration-500">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950 dark:to-slate-900 px-4 py-16 sm:px-6 sm:py-20 md:py-24 transition-colors duration-500">
      
      {/* ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-60 -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-300/40 blur-[80px] sm:h-80 sm:w-125 sm:blur-[100px] md:h-125 md:w-175 md:blur-[120px] dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-slate-400/30 blur-[60px] sm:h-64 sm:w-64 sm:blur-[80px] md:h-100 md:w-100 md:blur-[100px] dark:bg-slate-600/20" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="mb-3 inline-block rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-medium uppercase tracking-wider text-indigo-700 backdrop-blur-md dark:border-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-300 transition-colors duration-500">
            How it works
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-white transition-colors duration-500">
            From search to seat{" "}
            <span className="bg-gradient-to-r from-slate-600 via-indigo-600 to-indigo-500 bg-clip-text text-transparent dark:from-slate-300 dark:via-indigo-300 dark:to-indigo-200">
              in four easy steps.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 sm:text-base dark:text-slate-300/70 transition-colors duration-500">
            Booking your next event with EventFlow takes less than two minutes,
            start to finish.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-10 sm:flex-row sm:gap-6 md:gap-8"
        >
          {steps.map((s, index) => (
            <StepCard key={s.step} {...s} isLast={index === steps.length - 1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}