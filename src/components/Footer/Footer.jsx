"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";
import { GiThunderBlade } from "react-icons/gi";
import { Send, Ticket } from "lucide-react";
const footerLinks = {
  Product: ["Browse Events", "Create Event", "Pricing", "Features"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: [
    "Help Center",
    "Documentation",
    "Privacy Policy",
    "Terms of Service",
  ],
};

const socials = [
  {
    icon: FaFacebook,
    href: "#",
  },
  {
    icon: BsTwitter,
    href: "#",
  },
  {
    icon: BsInstagram,
    href: "#",
  },
  {
    icon: LiaLinkedin,
    href: "#",
  },
  {
    icon: GiThunderBlade,
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{
                  rotate: 12,
                  scale: 1.1,
                }}
                className="rounded-xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-500/30"
              >
                <Ticket size={24} />
              </motion.div>

              <span className="text-3xl font-bold tracking-tight">EventFlow</span>
            </Link>

            <p className="mt-6 max-w-sm leading-7 text-slate-600 dark:text-slate-400">
              Discover amazing events, book tickets instantly, and create
              unforgettable experiences with our modern ticket booking platform.
            </p>

            <div className="mt-8 flex gap-3">
              {socials.map(({ icon: Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{
                    y: -5,
                    scale: 1.15,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl border border-slate-300 bg-white p-3 text-slate-600 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5">
            {Object.entries(footerLinks).map(([title, links], index) => (
              <motion.div
                key={title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
              >
                <h3 className="mb-5 font-semibold text-slate-900 dark:text-white">
                  {title}
                </h3>

                <ul className="space-y-3">
                  {links.map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-slate-600 transition-all hover:translate-x-1 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl border border-white/20 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="text-xl font-bold">Stay Updated</h3>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Get the latest events and exclusive offers delivered straight to
                your inbox.
              </p>

              <div className="mt-6 space-y-4">
                {" "}
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                />
                <motion.button
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700"
                >
                  Subscribe
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-8 text-sm text-slate-500 dark:border-slate-800 md:flex-row"
        >
          <p>© {new Date().getFullYear()} EventFlow. All rights reserved.</p>

          <div className="flex gap-6">
            <Link
              href="#"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Privacy
            </Link>

            <Link
              href="#"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Terms
            </Link>

            <Link
              href="#"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
