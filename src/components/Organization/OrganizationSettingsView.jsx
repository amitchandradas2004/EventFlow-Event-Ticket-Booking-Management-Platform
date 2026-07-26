"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Settings, ArrowLeft } from "lucide-react";
import OrganizationTable from "./OrganizationTable";
import AddOrganizationForm from "./AddOrganizationForm";
import { getOrganizationByUserEmail } from "@/lib/actions/organization";

export default function OrganizationSettingsView({
  initialEmail = "",
  initialOrganizations = [],
  initialPagination = { total: 0, page: 1, limit: 10, totalPages: 1 }
}) {
  const [view, setView] = useState("table");
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [pagination, setPagination] = useState(initialPagination);

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
    if (newPage === pagination.page || newPage < 1 || newPage > pagination.totalPages) return;

    try {
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
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
          onPageChange={handlePageChange}
          onDeleteOrganization={handleDeleteOrganization}
        />
      ) : (
        <AddOrganizationForm
          initialEmail={initialEmail}
          onSubmitSuccess={handleOrganizationAdded}
        />
      )}
    </div>
  );
}
