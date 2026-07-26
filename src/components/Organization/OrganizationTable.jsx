"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Inbox,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import OrganizationDetailsModal from "./OrganizationDetailsModal";

export default function OrganizationTable({
  organizations = [],
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onPageChange
}) {
  const [imageErrors, setImageErrors] = useState({});
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleOpenDetails = (org) => {
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedOrg(null);
  };

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={13} />
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle size={13} />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock size={13} />
        Pending
      </span>
    );
  };

  const effectiveTotal = totalCount || organizations.length;
  const effectiveTotalPages = totalPages || Math.ceil(effectiveTotal / itemsPerPage) || 1;

  // Calculate slice range for display info
  const startItem = effectiveTotal === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, effectiveTotal);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl overflow-hidden"
      >
        {/* HEADER BAR */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 size={20} className="text-indigo-500" />
              My Organizations
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              List of organizations created under your account.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            Total: {effectiveTotal}
          </span>
        </div>

        {/* EMPTY STATE OR TABLE */}
        {organizations.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
              <Inbox size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Organization Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              You haven't submitted any organization profiles yet. Click on <strong>Add Organization</strong> at the top to create one!
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-6">Organization</th>
                    <th className="py-4 px-6">Website</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70 text-sm">
                  {organizations.map((org, index) => {
                    const id = org._id || index;
                    const hasImgError = imageErrors[id];

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* ORGANIZATION & LOGO */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="relative w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                              {org.logo && !hasImgError ? (
                                // eslint-disable-next-next-no-img-element
                                <img
                                  src={org.logo}
                                  alt={org.organizationName}
                                  className="w-full h-full object-cover"
                                  onError={() => handleImageError(id)}
                                />
                              ) : (
                                <Building2 size={20} className="text-slate-400 dark:text-slate-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                                {org.organizationName || "Unnamed Organization"}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                {org.organizerEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* WEBSITE */}
                        <td className="py-4 px-6">
                          {org.website ? (
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                            >
                              <Globe size={14} />
                              <span className="max-w-[160px] truncate">{org.website}</span>
                              <ExternalLink size={11} className="shrink-0 opacity-70" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-6">
                          {getStatusBadge(org.status)}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="View details"
                              onClick={() => handleOpenDetails(org)}
                              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              title="Edit organization"
                              className="p-2 rounded-xl text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition cursor-pointer"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="p-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-white">{startItem}</strong> to{" "}
                <strong className="text-slate-900 dark:text-white">{endItem}</strong> of{" "}
                <strong className="text-slate-900 dark:text-white">{effectiveTotal}</strong> organizations
              </span>

              <div className="flex items-center gap-1.5">
                {/* PREVIOUS BUTTON */}
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* PAGE NUMBERS */}
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onPageChange && onPageChange(p)}
                      className={`w-8 h-8 rounded-xl font-semibold transition cursor-pointer flex items-center justify-center ${
                        p === currentPage
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* NEXT BUTTON */}
                <button
                  type="button"
                  disabled={currentPage >= effectiveTotalPages}
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* ORGANIZATION DETAILS MODAL */}
      <OrganizationDetailsModal
        organization={selectedOrg}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
      />
    </>
  );
}
