"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Globe,
  Image as ImageIcon,
  FileText,
  X,
  Loader2,
  Save,
  Edit3
} from "lucide-react";
import toast from "react-hot-toast";
import { updateOrganizationById } from "@/lib/actions/organization";

export default function EditOrganizationModal({ organization, isOpen, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    organizationName: "",
    logo: "",
    website: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organization) {
      setFormData({
        organizationName: organization.organizationName || "",
        logo: organization.logo || "",
        website: organization.website || "",
        description: organization.description || ""
      });
    }
  }, [organization]);

  if (!organization) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!organization._id) {
      toast.error("Organization ID missing");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData
      };

      await updateOrganizationById(organization._id, payload);
      toast.success("Organization updated successfully!");

      if (onUpdateSuccess) {
        onUpdateSuccess({
          ...organization,
          ...payload
        });
      }
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to update organization");
    } finally {
      setLoading(false);
    }
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
            onClick={() => !loading && onClose()}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Modal Box */}
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
              disabled={loading}
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-4 pr-6">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Edit3 size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Edit Organization
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update details for {organization.organizationName || "organization"}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Organization Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Building2 size={14} className="text-indigo-500" />
                  Organization Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
                  <input
                    type="text"
                    name="organizationName"
                    required
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Enter organization name"
                    className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-indigo-500" />
                  Logo URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
                  <input
                    type="url"
                    name="logo"
                    required
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Globe size={14} className="text-indigo-500" />
                  Website URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
                  <input
                    type="url"
                    name="website"
                    required
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://myorganization.com"
                    className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText size={14} className="text-indigo-500" />
                  Description <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter organization description..."
                    className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
