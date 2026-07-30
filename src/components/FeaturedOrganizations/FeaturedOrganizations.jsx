"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, ShieldCheck, ArrowRight, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { getApprovedOrganizations } from "@/lib/actions/organization";
import OrganizationDetailsModal from "@/components/Organization/OrganizationDetailsModal";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FeaturedOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchOrgs() {
      try {
        setLoading(true);
        const data = await getApprovedOrganizations(6);
        const fetched = data?.result || [];
        setOrganizations(fetched.slice(0, 6));
      } catch (err) {
        console.error("Error fetching approved organizations from database:", err);
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrgs();
  }, []);

  const handleOpenDetails = (org) => {
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedOrg(null);
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-100/80 py-16 px-4 transition-colors duration-300 dark:bg-[#080B21] sm:py-24 sm:px-6">
      {/* Background ambient glow accents */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[130px] dark:bg-purple-600/20" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[130px] dark:bg-indigo-600/20" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold tracking-wide text-emerald-600 dark:border-emerald-400/20 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Approved
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
              Featured Organizations
            </h2>
            <p className="mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Verified partners and top organizers hosting premier concerts, tech summits, and cultural events.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Explore all partners
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Skeleton Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-3/4 rounded-md bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-8 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : organizations.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-12 text-center backdrop-blur-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Approved Organizations Yet</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Approved organizer organizations will appear here once verified by the platform admin.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {organizations.map((org, index) => (
              <motion.article
                key={org._id || index}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleOpenDetails(org)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:border-indigo-500/15 dark:bg-indigo-950/20 dark:hover:border-indigo-500/35 dark:hover:bg-indigo-950/40 backdrop-blur-xl cursor-pointer"
              >
                <div>
                  {/* Header info & Logo */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-800 shrink-0">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.organizationName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-indigo-500 dark:text-indigo-400">
                          <Building2 className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Admin Approved Badge */}
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                    {org.organizationName}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
                    {org.description || "Official verified organizer hosting high quality events on EventFlow."}
                  </p>
                </div>

                {/* Footer action */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/80">
                  {org.website ? (
                    <a
                      href={org.website.startsWith("http") ? org.website : `https://${org.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition"
                    >
                      <Globe className="h-3.5 w-3.5 text-indigo-500" />
                      Website
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" /> EventFlow Partner
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(org);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
                  >
                    View Details <Info className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      {/* Organization Details Modal */}
      <OrganizationDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        organization={selectedOrg}
        isSectionModal={true}
      />
    </section>
  );
}
