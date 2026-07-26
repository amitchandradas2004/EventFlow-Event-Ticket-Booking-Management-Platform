"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Globe,
  ExternalLink,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  ShieldAlert
} from "lucide-react";

export default function OrganizationDetailsModal({ organization, isOpen, onClose }) {
  const [logoError, setLogoError] = useState(false);

  if (!organization) return null;

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={14} />
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle size={14} />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock size={14} />
        Pending Verification
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header: Logo & Title */}
            <div className="flex items-start gap-4 pr-8">
              <div className="relative w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                {organization.logo && !logoError ? (
                  // eslint-disable-next-next-no-img-element
                  <img
                    src={organization.logo}
                    alt={organization.organizationName}
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Building2 size={28} className="text-slate-400 dark:text-slate-500" />
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white break-words">
                  {organization.organizationName || "Unnamed Organization"}
                </h3>
                <div>{getStatusBadge(organization.status)}</div>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-4 pt-2">
              {/* Website */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Globe size={13} className="text-indigo-500" />
                  Website
                </span>
                {organization.website ? (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                  >
                    <span>{organization.website}</span>
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">Not specified</p>
                )}
              </div>

              {/* Organizer Email */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Mail size={13} className="text-indigo-500" />
                  Organizer Email
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">
                  {organization.organizerEmail || "Not provided"}
                </p>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <FileText size={13} className="text-indigo-500" />
                  About Organization
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {organization.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
