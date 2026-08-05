"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminUsers, toggleUserBlockStatus } from "@/lib/actions/user";
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Crown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  User,
  Shield,
  Briefcase,
  Lock,
  Unlock,
  Loader2,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    admins: 0,
    organizers: 0,
    attendees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Admin Restriction Modal State
  const [restrictedAdminUser, setRestrictedAdminUser] = useState(null);
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Users from Backend
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers(
        page,
        10,
        debouncedSearch,
        selectedRole,
        selectedStatus
      );

      if (data?.success) {
        setUsers(data.result || []);
        setTotalUsers(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        setUsers([]);
        toast.error(data?.message || "Failed to load users");
      }
    } catch (err) {
      console.error("Error loading users:", err);
      toast.error("Failed to load user accounts");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedRole, selectedStatus]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle Block / Unblock action
  const handleToggleBlock = async (userToUpdate) => {
    const userId = userToUpdate._id || userToUpdate.id || userToUpdate.email;
    const targetStatus = !userToUpdate.isBlocked;
    const actionLabel = targetStatus ? "block" : "unblock";

    // RESTRICTION: An admin cannot block another admin
    if (targetStatus && (userToUpdate.role || "").toLowerCase() === "admin") {
      setRestrictedAdminUser(userToUpdate);
      setIsRestrictionModalOpen(true);
      return;
    }

    try {
      setUpdatingId(userId);
      const res = await toggleUserBlockStatus(userId, targetStatus);

      if (res?.success) {
        toast.success(
          `User ${userToUpdate.name || userToUpdate.email} successfully ${actionLabel}ed!`
        );

        // Optimistically update local state
        setUsers((prevUsers) =>
          prevUsers.map((u) => {
            const currentId = u._id || u.id || u.email;
            if (currentId === userId) {
              return { ...u, isBlocked: targetStatus, status: targetStatus ? "blocked" : "active" };
            }
            return u;
          })
        );

        // Update stats
        setStats((prev) => ({
          ...prev,
          activeUsers: targetStatus ? Math.max(0, prev.activeUsers - 1) : prev.activeUsers + 1,
          blockedUsers: targetStatus ? prev.blockedUsers + 1 : Math.max(0, prev.blockedUsers - 1),
        }));
      } else {
        // If server returns forbidden or error for admin block
        if (res?.message?.includes("Administrators")) {
          setRestrictedAdminUser(userToUpdate);
          setIsRestrictionModalOpen(true);
        } else {
          toast.error(res?.message || `Failed to ${actionLabel} user`);
        }
      }
    } catch (err) {
      console.error(`Error toggling block status:`, err);
      toast.error(`Error attempting to ${actionLabel} user`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role) => {
    const r = (role || "attendee").toLowerCase();
    if (r === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm">
          <Shield size={12} className="text-amber-500" /> Admin
        </span>
      );
    }
    if (r === "organizer") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shadow-sm">
          <Briefcase size={12} className="text-indigo-500" /> Organizer
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-sm">
        <User size={12} className="text-teal-500" /> Attendee
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-900/50 via-slate-900/60 to-purple-900/40 p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl backdrop-blur-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <ShieldCheck size={14} className="text-indigo-400" /> Admin Access & User Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            User Management Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Monitor registered platform accounts, view user credentials, filter by roles, and manage access by blocking or unblocking accounts.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition cursor-pointer shrink-0 self-start md:self-auto backdrop-blur-md"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-indigo-400" : "text-indigo-300"} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Users</span>
            <Users size={16} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.totalUsers}</p>
        </div>

        {/* Active Users */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active</span>
            <UserCheck size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{stats.activeUsers}</p>
        </div>

        {/* Blocked Users */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Blocked</span>
            <UserX size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{stats.blockedUsers}</p>
        </div>

        {/* Admins */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Admins</span>
            <Shield size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500 mt-2">{stats.admins}</p>
        </div>

        {/* Organizers */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Organizers</span>
            <Briefcase size={16} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-500 mt-2">{stats.organizers}</p>
        </div>

        {/* Attendees */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Attendees</span>
            <User size={16} className="text-teal-500" />
          </div>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-2">{stats.attendees}</p>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
              <Filter size={12} /> Role:
            </span>
            {["all", "attendee", "organizer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRole(r);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                  selectedRole === r
                    ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 px-2">Status:</span>
            {[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Blocked", value: "blocked" },
            ].map((st) => (
              <button
                key={st.value}
                onClick={() => {
                  setSelectedStatus(st.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedStatus === st.value
                    ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Table Card Container */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          /* Loading Skeletons */
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="space-y-2">
                    <div className="w-36 h-4 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="w-48 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-6 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="w-24 h-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
              <Users size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Users Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                {searchQuery || selectedRole !== "all" || selectedStatus !== "all"
                  ? "No accounts match your current filter and search query."
                  : "There are no registered user accounts currently in the system."}
              </p>
            </div>
            {(searchQuery || selectedRole !== "all" || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("all");
                  setSelectedStatus("all");
                  setPage(1);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          /* Users Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User Info</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                <AnimatePresence mode="popLayout">
                  {users.map((u) => {
                    const userId = u._id || u.id || u.email;
                    const isBlocked = Boolean(u.isBlocked);
                    const isUpdating = updatingId === userId;
                    const isAdmin = (u.role || "").toLowerCase() === "admin";

                    return (
                      <motion.tr
                        key={userId}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        {/* User Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            {/* Profile Image Avatar */}
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 shrink-0 border border-indigo-500/30 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {u.image ? (
                                <img
                                  src={u.image}
                                  alt={u.name || u.email}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span>{(u.name || u.email || "U").charAt(0).toUpperCase()}</span>
                              )}
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white truncate">
                                  {u.name || "Unnamed User"}
                                </span>
                                {u.isPremium && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                    <Crown size={10} /> PRO
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] truncate">
                                <Mail size={12} className="shrink-0 text-slate-400" />
                                <span className="truncate">{u.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          {getRoleBadge(u.role)}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          {isBlocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm">
                              <XCircle size={12} className="text-rose-500" /> Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
                              <CheckCircle2 size={12} className="text-emerald-500" /> Active
                            </span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-6 whitespace-nowrap text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-400" />
                            <span>
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Action Buttons: Block / Unblock */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {isBlocked ? (
                              /* UNBLOCK BUTTON */
                              <button
                                type="button"
                                onClick={() => handleToggleBlock(u)}
                                disabled={isUpdating}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 disabled:opacity-50 transition cursor-pointer"
                              >
                                {isUpdating ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Unlock size={14} />
                                )}
                                <span>Unblock</span>
                              </button>
                            ) : (
                              /* BLOCK BUTTON */
                              <button
                                type="button"
                                onClick={() => handleToggleBlock(u)}
                                disabled={isUpdating}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition cursor-pointer ${
                                  isAdmin
                                    ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 border border-slate-300/80 dark:border-slate-700"
                                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
                                }`}
                              >
                                {isUpdating ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Lock size={14} />
                                )}
                                <span>Block</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Page {page} of {totalPages} ({totalUsers} users)
            </span>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Admin Block Restriction Modal */}
      <AnimatePresence>
        {isRestrictionModalOpen && restrictedAdminUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsRestrictionModalOpen(false);
                setRestrictedAdminUser(null);
              }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsRestrictionModalOpen(false);
                  setRestrictedAdminUser(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Warning Icon Banner */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10">
                    <ShieldAlert size={36} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow">
                    !
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 inline-block">
                    Action Restricted
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Cannot Block Administrator
                  </h3>
                </div>
              </div>

              {/* Target Admin Card Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-indigo-600 shrink-0 border border-amber-500/40 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {restrictedAdminUser.image ? (
                    <img
                      src={restrictedAdminUser.image}
                      alt={restrictedAdminUser.name || restrictedAdminUser.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(restrictedAdminUser.name || restrictedAdminUser.email || "A").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {restrictedAdminUser.name || "Admin Account"}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {restrictedAdminUser.email}
                  </p>
                </div>
              </div>

              {/* Message Explanation */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                Administrators possess top-level system authority and cannot be blocked directly. If you need to restrict this account's access, please demote their role first.
              </p>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  setIsRestrictionModalOpen(false);
                  setRestrictedAdminUser(null);
                }}
                className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition cursor-pointer"
              >
                Understood & Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
