"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminTransactions } from "@/lib/actions/payment";
import {
  CreditCard,
  DollarSign,
  Receipt,
  Crown,
  Ticket,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Layers,
  Inbox,
  X,
  User,
  Mail,
  ShieldCheck,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";

// TYPE FILTER OPTIONS
const TYPE_OPTIONS = [
  {
    value: "all",
    label: "All Transaction Types",
    icon: Layers,
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    value: "premium_membership",
    label: "Premium Plan ($49)",
    icon: Crown,
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    value: "event_booking",
    label: "Event Ticket Sales",
    icon: Ticket,
    color: "text-purple-600 dark:text-purple-400",
  },
];

// CUSTOM SELECT DROPDOWN COMPONENT
function CustomFilterSelect({ value, onChange, options, placeholder = "Select option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];
  const SelectedIcon = selectedOption.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 w-full sm:w-56" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <SelectedIcon size={16} className={selectedOption.color} />
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {options.map((option) => {
              const IconComponent = option.icon;
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <IconComponent size={14} className={option.color} />
                    </span>
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FULL PAGE SKELETON COMPONENT
function AdminTransactionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-60 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-96 bg-slate-200/70 dark:bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4">
        <div className="h-10 w-full sm:w-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-10 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4 text-center"><div className="h-4 w-16 mx-auto bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4 text-center"><div className="h-4 w-16 mx-auto bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4"><div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" /></td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-1" />
                    <div className="h-3 w-40 bg-slate-200/70 dark:bg-slate-800/60 rounded-md" />
                  </td>
                  <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" /></td>
                  <td className="px-6 py-4 text-center"><div className="h-6 w-20 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                  <td className="px-6 py-4 text-center"><div className="h-8 w-20 mx-auto bg-slate-200 dark:bg-slate-800 rounded-xl" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    premiumPurchasesCount: 0,
    eventBookingsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Transaction Details Modal State
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch transactions when page, search, or type changes
  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);
      getAdminTransactions(page, 10, debouncedSearch, selectedType, "all")
        .then((data) => {
          if (!isCancelled) {
            if (data?.success) {
              setTransactions(data.result || []);
              setTotalCount(data.total || 0);
              setTotalPages(data.totalPages || 1);
              if (data.stats) {
                setStats(data.stats);
              }
            } else {
              setTransactions([]);
              toast.error(data?.message || "Failed to load transactions");
            }
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error("Error loading transactions:", err);
            toast.error("Failed to load transactions list");
            setTransactions([]);
            setLoading(false);
          }
        });
    }, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [page, debouncedSearch, selectedType]);

  const handleRefresh = () => {
    setLoading(true);
    getAdminTransactions(page, 10, debouncedSearch, selectedType, "all")
      .then((data) => {
        if (data?.success) {
          setTransactions(data.result || []);
          setTotalCount(data.total || 0);
          setTotalPages(data.totalPages || 1);
          if (data.stats) {
            setStats(data.stats);
          }
        } else {
          setTransactions([]);
          toast.error(data?.message || "Failed to load transactions");
        }
      })
      .catch((err) => {
        console.error("Error loading transactions:", err);
        toast.error("Failed to load transactions list");
        setTransactions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    if (num === 0) return "Free";
    return `$${num.toFixed(2)}`;
  };

  const getTypeBadge = (type) => {
    if (type === "premium_membership") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <Crown size={13} />
          Premium Plan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
        <Ticket size={13} />
        Event Ticket
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const s = (status || "completed").toLowerCase();
    if (s === "completed" || s === "paid") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={13} />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock size={13} />
        Pending
      </span>
    );
  };

  // IF FULL PAGE LOADING
  if (loading && transactions.length === 0) {
    return <AdminTransactionsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="text-indigo-600 dark:text-indigo-400" size={26} />
            Financial Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor all revenue, organizer premium plan purchases, and ticket sales across EventFlow.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-300 mt-2">
            ${Number(stats.totalRevenue || 0).toFixed(2)}
          </p>
        </div>

        {/* Total Transactions */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Transactions
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Receipt size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.totalTransactions}
          </p>
        </div>

        {/* Premium Purchases */}
        <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/30 bg-amber-50/40 dark:bg-amber-950/20 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Premium Plan Sales
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Crown size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-900 dark:text-amber-300 mt-2">
            {stats.premiumPurchasesCount}
          </p>
        </div>

        {/* Ticket Bookings */}
        <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900/30 bg-purple-50/40 dark:bg-purple-950/20 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Event Ticket Sales
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Ticket size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-purple-900 dark:text-purple-300 mt-2">
            {stats.eventBookingsCount}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="relative z-30 flex flex-col lg:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transaction ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Custom Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Type Filter */}
          <CustomFilterSelect
            value={selectedType}
            onChange={(val) => {
              setSelectedType(val);
              setPage(1);
            }}
            options={TYPE_OPTIONS}
          />
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="relative z-10 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4">Transaction ID</th>
                <th scope="col" className="px-6 py-4">Customer</th>
                <th scope="col" className="px-6 py-4">Type</th>
                <th scope="col" className="px-6 py-4">Purchased Item</th>
                <th scope="col" className="px-6 py-4">Amount</th>
                <th scope="col" className="px-6 py-4">Date & Time</th>
                <th scope="col" className="px-6 py-4 text-center">Status</th>
                <th scope="col" className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" /></td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-1" />
                      <div className="h-3 w-40 bg-slate-200/70 dark:bg-slate-800/60 rounded-md" />
                    </td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-6 w-20 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-8 w-20 mx-auto bg-slate-200 dark:bg-slate-800 rounded-xl" /></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-3">
                      <Inbox size={40} strokeWidth={1.5} />
                      <p className="text-base font-medium">No transactions found</p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedType("all");
                          setPage(1);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr
                    key={txn.id || txn.transactionId}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* 1. Transaction ID */}
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900 dark:text-white max-w-[140px] truncate" title={txn.transactionId}>
                      {txn.transactionId}
                    </td>

                    {/* 2. Customer */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {txn.userName || "Customer"}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate" title={txn.userEmail}>
                        {txn.userEmail}
                      </p>
                    </td>

                    {/* 3. Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(txn.type)}
                    </td>

                    {/* 4. Purchased Item */}
                    <td className="px-6 py-4 max-w-xs truncate" title={txn.item}>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {txn.item}
                      </span>
                    </td>

                    {/* 5. Amount */}
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                      {formatCurrency(txn.amount)}
                    </td>

                    {/* 6. Date & Time */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                      {formatDate(txn.date)}
                    </td>

                    {/* 7. Status */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {getStatusBadge(txn.paymentStatus)}
                    </td>

                    {/* 8. Action (Details Button) */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedTxn(txn)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-700 shadow-xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-700 transition-all cursor-pointer"
                      >
                        <Eye size={14} />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div>
              Showing <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * 10 + 1}</span> to{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {Math.min(page * 10, totalCount)}
              </span>{" "}
              of <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> transactions
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span className="px-2 text-slate-600 dark:text-slate-300 font-semibold">
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TRANSACTION DETAILS MODAL */}
      <AnimatePresence>
        {selectedTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTxn(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Receipt size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Transaction Details
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    ID: {selectedTxn.transactionId}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-700 dark:text-slate-200">
                {/* Type & Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Type & Status</span>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(selectedTxn.type)}
                    {getStatusBadge(selectedTxn.paymentStatus)}
                  </div>
                </div>

                {/* Customer Email */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <User size={15} />
                    <span>Customer</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white text-xs">
                      {selectedTxn.userName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {selectedTxn.userEmail}
                    </p>
                  </div>
                </div>

                {/* Purchased Item */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Ticket size={15} />
                    <span>Item</span>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white text-xs max-w-[220px] text-right truncate">
                    {selectedTxn.item}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Calendar size={15} />
                    <span>Date & Time</span>
                  </div>
                  <p className="font-medium text-xs text-slate-800 dark:text-slate-200">
                    {formatDate(selectedTxn.date)}
                  </p>
                </div>

                {/* Amount Paid */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="font-bold text-slate-900 dark:text-white text-base">Total Amount Paid</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-xl">
                    {formatCurrency(selectedTxn.amount)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedTxn(null)}
                  className="w-full rounded-2xl bg-slate-100 dark:bg-slate-800 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
