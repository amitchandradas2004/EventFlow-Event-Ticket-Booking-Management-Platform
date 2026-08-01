"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Settings, ArrowLeft, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import OrganizationTable from "./OrganizationTable";
import AddOrganizationForm from "./AddOrganizationForm";
import { getOrganizationByUserEmail } from "@/lib/actions/organization";

export default function OrganizationSettingsView({
  initialEmail = "",
  initialOrganizations = [],
  initialPagination = { total: 0, page: 1, limit: 10, totalPages: 1 },
  isPremium = false
}) {
  const [view, setView] = useState("table");
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  const isLimitReached = !isPremium && pagination.total >= 10;

  const handleOrganizationAdded = (newOrg) => {
    setOrganizations((prev) => [newOrg, ...prev]);
    setPagination((prev) => {
      const newTotal = prev.total + 1;
      return {
        ...prev,
        total: newTotal,
        totalPages: Math.ceil(newTotal / prev.limit) || 1
      };
    });
    setView("table");
  };

  const handleUpdateOrganization = (updatedOrg) => {
    setOrganizations((prev) =>
      prev.map((org) => (org._id === updatedOrg._id ? { ...org, ...updatedOrg } : org))
    );
  };

  const handleDeleteOrganization = (deletedId) => {
    setOrganizations((prev) => prev.filter((org) => org._id !== deletedId));
    setPagination((prev) => {
      const newTotal = Math.max(0, prev.total - 1);
      return {
        ...prev,
        total: newTotal,
        totalPages: Math.ceil(newTotal / prev.limit) || 1
      };
    });
  };

  const handlePageChange = async (newPage) => {
    if (newPage === pagination.page || newPage < 1 || newPage > pagination.totalPages || isLoading) return;

    try {
      setIsLoading(true);
      const response = await getOrganizationByUserEmail(initialEmail, newPage, pagination.limit);
      if (response?.result && Array.isArray(response.result)) {
        setOrganizations(response.result);
        setPagination({
          total: response.total ?? response.result.length,
          page: response.page || newPage,
          limit: response.limit || 10,
          totalPages: response.totalPages || 1
        });
      }
    } catch (err) {
      toast.error(err?.message || "Failed to load page data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 container mx-auto">
      {/* WARNING BANNER FOR NON-PREMIUM USERS AT FREE LIMIT */}
      {isLimitReached && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-amber-300/80 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 p-5 sm:p-6 backdrop-blur-xl dark:border-amber-500/30 dark:bg-amber-950/40 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                <AlertTriangle size={22} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                    Free Organization Limit Reached ({pagination.total}/10)
                  </h3>
                  <span className="rounded-full bg-amber-200/80 dark:bg-amber-900/60 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                    Starter Plan
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  You have reached the maximum 10 free organizations for Starter accounts. Upgrade your account to <strong className="font-bold text-amber-950 dark:text-white">Premium ($49 Lifetime)</strong> to publish unlimited organizations!
                </p>
              </div>
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-indigo-700 transition-all shrink-0 cursor-pointer"
            >
              <Sparkles size={15} />
              Upgrade to Premium
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* HEADER WITH TOP ACTION / SETTINGS BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Settings size={18} />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Organization Settings
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your organization profiles, view status, and create new organizations.
          </p>
        </div>

        {/* TOP LINK / ACTION BUTTON */}
        <div className="flex items-center gap-3">
          {view === "table" ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("add")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Organization</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("table")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span>Back to Organizations</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      {view === "table" ? (
        <OrganizationTable
          organizations={organizations}
          totalCount={pagination.total}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.limit}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onDeleteOrganization={handleDeleteOrganization}
          onUpdateOrganization={handleUpdateOrganization}
        />
      ) : (
        <AddOrganizationForm
          initialEmail={initialEmail}
          onSubmitSuccess={handleOrganizationAdded}
          isPremium={isPremium}
          totalOrganizations={pagination.total}
        />
      )}
    </div>
  );
}
