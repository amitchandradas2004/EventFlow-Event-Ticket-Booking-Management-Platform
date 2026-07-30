"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, Globe, ShieldCheck, Mail, X, ExternalLink, Sparkles } from "lucide-react";

export default function OrganizationDetailsModal({ isOpen, onClose, organization }) {
  return (
    <AnimatePresence>
      {isOpen && organization && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity cursor-pointer"
          />

          {/* Centering Flexbox Wrapper */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-left">
            {/* Modal Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg my-auto overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-10"
            >
              {/* Header Banner */}
              <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 relative p-4 flex items-start justify-end">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="relative z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md transition p-2 rounded-full cursor-pointer"
                  aria-label="Close details modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pb-6 pt-0 relative">
                {/* Logo Avatar overlapping header */}
                <div className="-mt-12 mb-4 flex items-end justify-between">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-xl shrink-0">
                    {organization.logo ? (
                      <img
                        src={organization.logo}
                        alt={organization.organizationName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Building2 className="h-10 w-10" />
                      </div>
                    )}
                  </div>

                  {/* Verified Badge */}
                  <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <ShieldCheck className="h-4 w-4" /> Admin Verified
                  </span>
                </div>

                {/* Organization Title & Email */}
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {organization.organizationName}
                  </h3>
                  {organization.organizerEmail && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Mail className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{organization.organizerEmail}</span>
                    </div>
                  )}
                </div>

                {/* About Section */}
                <div className="mt-5 space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    About Organization
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {organization.description || "Official verified organizer hosting premier events, concerts, and conferences on EventFlow."}
                  </p>
                </div>

                {/* Website Section */}
                {organization.website && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <a
                      href={organization.website.startsWith("http") ? organization.website : `https://${organization.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{organization.website}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
