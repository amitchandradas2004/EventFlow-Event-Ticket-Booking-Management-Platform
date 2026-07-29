"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Image as ImageIcon,
  Tag,
  PlusCircle,
  Loader2,
  AlertCircle,
  Lock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  Zap
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getOrganizationByUserEmail } from "@/lib/actions/organization";
import { addEvent } from "@/lib/actions/event";

const EVENT_CATEGORIES = [
  "Technology & IT",
  "Music & Concerts",
  "Business & Networking",
  "Workshops & Seminars",
  "Sports & Fitness",
  "Arts & Culture",
  "Education & Learning",
  "Other"
];

export default function AddEventForm({ onEventCreated }) {
  const { data: session, isPending: sessionLoading } = useSession();

  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [loading, setLoading] = useState(false);

  // Custom Dropdown Open States
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const orgDropdownRef = useRef(null);
  const catDropdownRef = useRef(null);
  const datePickerRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    banner: "",
    category: "",
    location: "",
    date: "",
    ticketPrice: "",
    availableSeats: "",
    description: ""
  });

  // Internal date/time values for custom picker popover
  const [customDateVal, setCustomDateVal] = useState("");
  const [customTimeVal, setCustomTimeVal] = useState("18:00");

  const [bannerPreviewError, setBannerPreviewError] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target)) {
        setOrgDropdownOpen(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
        setCatDropdownOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch organizer's organizations when session is loaded
  useEffect(() => {
    async function fetchOrgs() {
      if (!session?.user?.email) return;
      try {
        setLoadingOrgs(true);
        const res = await getOrganizationByUserEmail(session.user.email, 1, 50);
        if (res?.success && Array.isArray(res.result)) {
          setOrganizations(res.result);
          if (res.result.length === 1) {
            setSelectedOrgId(res.result[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load organizations:", err);
        toast.error("Failed to load your organizations");
      } finally {
        setLoadingOrgs(false);
      }
    }

    if (session?.user?.email) {
      fetchOrgs();
    } else if (!sessionLoading) {
      setLoadingOrgs(false);
    }
  }, [session, sessionLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "banner") setBannerPreviewError(false);
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectOrg = (orgId) => {
    setSelectedOrgId(orgId);
    setOrgDropdownOpen(false);
  };

  const handleSelectCategory = (cat) => {
    setFormData((prev) => ({ ...prev, category: cat }));
    setCatDropdownOpen(false);
  };

  // Date picker helpers
  const applyCustomDateTime = (dVal, tVal) => {
    if (!dVal) return;
    const timeToUse = tVal || "18:00";
    const combined = `${dVal}T${timeToUse}`;
    setFormData((prev) => ({ ...prev, date: combined }));
    setDatePickerOpen(false);
  };

  const handlePresetDate = (daysFromNow, timeStr = "18:00") => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const dateStr = d.toISOString().split("T")[0];
    setCustomDateVal(dateStr);
    setCustomTimeVal(timeStr);
    applyCustomDateTime(dateStr, timeStr);
  };

  const formatDisplayDateTime = (dtStr) => {
    if (!dtStr) return null;
    try {
      const dt = new Date(dtStr);
      if (isNaN(dt.getTime())) return dtStr;
      return dt.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return dtStr;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrgId) {
      toast.error("Please select an organization first.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select an event category.");
      return;
    }

    if (!formData.date) {
      toast.error("Please select an event date & time.");
      return;
    }

    if (!session?.user?.email) {
      toast.error("User session not found. Please log in.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        banner: formData.banner.trim(),
        category: formData.category,
        location: formData.location.trim(),
        date: formData.date,
        ticketPrice: Number(formData.ticketPrice),
        availableSeats: Number(formData.availableSeats),
        description: formData.description.trim(),
        organizationId: selectedOrgId,
        organizerEmail: session.user.email,
        status: "pending"
      };

      const result = await addEvent(payload);

      toast.success("Event submitted successfully! Status set to pending approval.");

      // Reset form
      setFormData({
        title: "",
        banner: "",
        category: "",
        location: "",
        date: "",
        ticketPrice: "",
        availableSeats: "",
        description: ""
      });
      setCustomDateVal("");
      setCustomTimeVal("18:00");

      if (onEventCreated) {
        onEventCreated(result);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = !selectedOrgId;
  const selectedOrg = organizations.find((o) => o._id === selectedOrgId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8"
    >
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Create New Event
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fill in the event details under your verified organization.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-medium text-amber-700 dark:text-amber-400 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Default Status: Pending Approval
        </div>
      </div>

      {/* Custom Organization Selection Box */}
      <div className="space-y-3 bg-gradient-to-r from-indigo-50/70 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900/50 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
            Select Your Organization <span className="text-rose-500">*</span>
          </span>
          {selectedOrgId && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              ✓ Selected
            </span>
          )}
        </label>

        {loadingOrgs ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 py-3 px-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            Loading your organizations...
          </div>
        ) : organizations.length === 0 ? (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-800 dark:text-amber-300 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>You don't have any registered organizations yet. Please create an organization first.</span>
            </div>
            <Link
              href="/dashboard/organizer/settings"
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0 shadow-sm"
            >
              Create Organization <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* Custom Styled Organization Dropdown */
          <div className="relative" ref={orgDropdownRef}>
            <button
              type="button"
              onClick={() => setOrgDropdownOpen((prev) => !prev)}
              className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl flex items-center justify-between text-left text-sm transition-all duration-200 shadow-sm ${
                orgDropdownOpen
                  ? "border-indigo-500 ring-2 ring-indigo-500/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center gap-1.5 justify-center text-indigo-600 dark:text-indigo-400 shrink-0 overflow-hidden">
                  {selectedOrg?.logo ? (
                    <img src={selectedOrg.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </div>
                <div className="truncate">
                  {selectedOrg ? (
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {selectedOrg.organizationName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {selectedOrg.website || selectedOrg.organizerEmail}
                      </p>
                    </div>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                      -- Choose an Organization --
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                  orgDropdownOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                }`}
              />
            </button>

            {/* Custom Dropdown List */}
            <AnimatePresence>
              {orgDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 4, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-30 top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50"
                >
                  {organizations.map((org) => {
                    const isSelected = org._id === selectedOrgId;
                    return (
                      <button
                        key={org._id}
                        type="button"
                        onClick={() => handleSelectOrg(org._id)}
                        className={`w-full px-4 py-3 text-left flex items-center justify-between text-sm transition-colors ${
                          isSelected
                            ? "bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 overflow-hidden">
                            {org.logo ? (
                              <img src={org.logo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-4 h-4" />
                            )}
                          </div>
                          <div className="truncate">
                            <p className="truncate font-medium">{org.organizationName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              Status: {org.status || "Active"}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Alert Banner when Form is Disabled */}
      {isFormDisabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-600 dark:text-slate-300 text-sm flex items-center gap-3 shadow-inner"
        >
          <Lock className="w-5 h-5 text-indigo-500 shrink-0 animate-pulse" />
          <span>
            <strong>Form Locked:</strong> Please select an organization from the dropdown above to unlock and fill out the event form.
          </span>
        </motion.div>
      )}

      {/* Main Event Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={isFormDisabled} className={isFormDisabled ? "opacity-50 cursor-not-allowed space-y-6" : "space-y-6"}>

          {/* Title & Banner URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Event Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Tech Innovators Summit 2026"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-sm transition outline-none"
                />
              </div>
            </div>

            {/* Banner URL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Banner Image URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="banner"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.banner}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-sm transition outline-none"
                />
              </div>
            </div>
          </div>

          {/* Banner Preview (if provided) */}
          {formData.banner && !bannerPreviewError && (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img
                src={formData.banner}
                alt="Banner Preview"
                className="w-full h-full object-cover"
                onError={() => setBannerPreviewError(true)}
              />
              <div className="absolute bottom-2 right-2 bg-slate-900/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs">
                Banner Preview
              </div>
            </div>
          )}

          {/* Custom Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom Category Select */}
            <div className="space-y-2 relative" ref={catDropdownRef}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Category <span className="text-rose-500">*</span>
              </label>

              <button
                type="button"
                disabled={isFormDisabled}
                onClick={() => setCatDropdownOpen((prev) => !prev)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl flex items-center justify-between text-left text-sm transition-all duration-200 ${
                  catDropdownOpen
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </div>
                <span className={formData.category ? "text-slate-900 dark:text-white font-medium" : "text-slate-400"}>
                  {formData.category || "-- Select Category --"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    catDropdownOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {catDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1"
                  >
                    {EVENT_CATEGORIES.map((cat) => {
                      const isSelected = cat === formData.category;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleSelectCategory(cat)}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                              : "hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Location / Venue <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Convention Center, Dhaka / Online"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-sm transition outline-none"
                />
              </div>
            </div>
          </div>

          {/* Custom Date Picker, Ticket Price & Available Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Custom Date & Time Picker */}
            <div className="space-y-2 relative" ref={datePickerRef}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Event Date & Time <span className="text-rose-500">*</span>
              </label>

              <button
                type="button"
                disabled={isFormDisabled}
                onClick={() => setDatePickerOpen((prev) => !prev)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl flex items-center justify-between text-left text-sm transition-all duration-200 ${
                  datePickerOpen
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className={formData.date ? "text-slate-900 dark:text-white font-medium truncate" : "text-slate-400 truncate"}>
                  {formData.date ? formatDisplayDateTime(formData.date) : "-- Select Date & Time --"}
                </span>
                <Clock className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>

              {/* Popover Custom Date & Time Picker */}
              <AnimatePresence>
                {datePickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-30 top-full left-0 w-80 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/70">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date & Time Selector
                      </span>
                      <button
                        type="button"
                        onClick={() => setDatePickerOpen(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" /> Quick Presets:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePresetDate(1, "18:00")}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition text-left"
                        >
                          Tomorrow (6 PM)
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePresetDate(3, "19:00")}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition text-left"
                        >
                          In 3 Days (7 PM)
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePresetDate(7, "10:00")}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition text-left"
                        >
                          In 1 Week (10 AM)
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePresetDate(30, "18:00")}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition text-left"
                        >
                          In 1 Month
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700/70 pt-3 space-y-3">
                      {/* Select Date */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={customDateVal}
                          onChange={(e) => setCustomDateVal(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Select Time */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Select Time
                        </label>
                        <input
                          type="time"
                          value={customTimeVal}
                          onChange={(e) => setCustomTimeVal(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/70">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, date: "" }));
                          setCustomDateVal("");
                          setDatePickerOpen(false);
                        }}
                        className="text-xs text-rose-500 hover:underline font-medium"
                      >
                        Clear
                      </button>

                      <button
                        type="button"
                        onClick={() => applyCustomDateTime(customDateVal, customTimeVal)}
                        disabled={!customDateVal}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                      >
                        Set Date & Time
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ticket Price */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Ticket Price ($ / ৳) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="ticketPrice"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-sm transition outline-none"
                />
              </div>
            </div>

            {/* Available Seats */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Available Seats <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="availableSeats"
                  min="1"
                  required
                  placeholder="100"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-sm transition outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                rows="4"
                required
                placeholder="Provide a comprehensive summary of your event schedule, key speakers, requirements, etc..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-sm transition outline-none resize-y"
              />
            </div>
          </div>

          {/* Auto-attached metadata preview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">Status:</span>
              <span className="inline-block px-2 py-0.5 mt-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-medium">
                pending
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">Organizer Email:</span>
              <span className="truncate block mt-0.5">{session?.user?.email || "N/A"}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isFormDisabled || loading}
              className={`px-8 py-3 rounded-xl text-white font-semibold text-sm shadow-lg flex items-center gap-2 transition duration-200 ${
                isFormDisabled
                  ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-indigo-500/25 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing Event...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Publish Event
                </>
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </motion.div>
  );
}
