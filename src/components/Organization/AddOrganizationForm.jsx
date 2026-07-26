"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Image as ImageIcon,
  FileText,
  Clock,
  PlusCircle,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  Mail
} from "lucide-react";
import toast from "react-hot-toast";
import { addOrganization } from "@/lib/actions/organization";

export default function AddOrganizationForm({ initialEmail = "", onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    organizationName: "",
    logo: "",
    website: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "logo") setLogoError(false);
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      ...formData,
      organizerEmail: initialEmail,
      status: "pending"
    };
    try {
      // Simulate form submission delay or API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      const result = await addOrganization(submissionData);
      console.log(result);

      toast.success("Organization application submitted successfully! Status set to pending.");
      if (onSubmitSuccess) {
        onSubmitSuccess(submissionData);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to submit organization application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* FORM CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="lg:col-span-7 w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6"
      >
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Building2 size={22} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Add New Organization
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Submit your organization details for verification and approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ORGANIZATION NAME */}
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
                placeholder="e.g. EventFlow Tech Community"
                className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* LOGO & WEBSITE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LOGO URL */}
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

            {/* WEBSITE */}
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
          </div>

          {/* DESCRIPTION */}
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
                placeholder="Briefly describe your organization's mission, goals, and event scope..."
                className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none resize-none"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting Organization...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Add Organization</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* LIVE PREVIEW CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        className="lg:col-span-5 w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl space-y-5 sticky top-6"
      >
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Preview
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize flex items-center gap-1">
            <Clock size={12} />
            pending
          </span>
        </div>

        {/* PREVIEW CONTENT */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {formData.logo && !logoError ? (
                // eslint-disable-next-next-no-img-element
                <img
                  src={formData.logo}
                  alt="Logo Preview"
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Building2 size={28} className="text-slate-400 dark:text-slate-500" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {formData.organizationName || "Organization Name"}
              </h4>
              {formData.website ? (
                <a
                  href={formData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate"
                >
                  <LinkIcon size={12} />
                  {formData.website}
                </a>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  https://yourwebsite.com
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              About Organization
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
              {formData.description ||
                "Organization description will appear here as you fill out the form."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
