"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  MapPin,
  Tag,
  DollarSign,
  Users,
  FileText,
  Building2,
  Mail,
  Ticket,
  LockKeyhole,
  LogIn,
  UserPlus,
  Plus,
  Minus,
  AlertCircle,
  Sparkles,
  CreditCard,
  Check,
} from "lucide-react";
import { createBooking } from "@/lib/actions/booking";

export default function EventDetailsModal({ event, isOpen, onClose, isSectionModal = false }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userRole = (user?.role || "attendee").toLowerCase();

  const [imageError, setImageError] = useState(false);

  // Sub-modal states for Ticket Booking Flow
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event) return null;

  const unitPrice = Number(event.ticketPrice || 0);
  const maxSeats = Math.min(10, Math.max(1, event.availableSeats || 10));
  const totalPrice = unitPrice * ticketQuantity;

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
        Pending Approval
      </span>
    );
  };

  const formattedDate = event.date
    ? new Date(event.date).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  const handleBookTicketClick = () => {
    if (user?.isBlocked === true || user?.status === "blocked") {
      toast.error("Your account has been blocked by an administrator. Ticket booking is disabled.");
      return;
    }
    if (!user || userRole !== "attendee") {
      setIsLoginModalOpen(true);
    } else {
      setTicketQuantity(1);
      setIsBookingSuccess(false);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      if (totalPrice > 0) {
        // Initiate Stripe Checkout for paid events
        const res = await fetch("/api/event_checkout_session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event._id,
            quantity: ticketQuantity,
          }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to initiate payment");
        }

        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }

      // Handle direct free booking ($0)
      const bookingRes = await createBooking({
        eventId: event._id,
        eventTitle: event.title,
        eventBanner: event.banner,
        eventDate: event.date,
        location: event.location,
        userEmail: user.email,
        userName: user.name || user.email,
        quantity: ticketQuantity,
        unitPrice: 0,
        totalPrice: 0,
        paymentStatus: "free",
        organizerEmail: event.organizerEmail,
      });

      if (bookingRes?.success) {
        setIsBookingSuccess(true);
        toast.success("Free ticket booked successfully!");
      } else {
        throw new Error(bookingRes?.message || "Failed to book ticket");
      }
    } catch (err) {
      toast.error(err.message || "Failed to book ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setTicketQuantity((prev) => {
      const nextVal = prev + delta;
      if (nextVal < 1) return 1;
      if (nextVal > maxSeats) return maxSeats;
      return nextVal;
    });
  };

  const overlayClass = isSectionModal
    ? "absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 min-h-full"
    : "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4";

  const backdropClass = isSectionModal
    ? "absolute inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
    : "fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer";

  const cardClass = isSectionModal
    ? "relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10"
    : "relative w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl rounded-b-none sm:rounded-3xl shadow-2xl z-10";

  const subModalOverlayClass = isSectionModal
    ? "absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 min-h-full"
    : "fixed inset-0 z-60 flex items-center justify-center p-4";

  const subModalBackdropClass = isSectionModal
    ? "absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
    : "fixed inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={overlayClass}>
          {/* Main Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={backdropClass}
          />

          {/* Event Details Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={cardClass}
          >
            {/* Header Banner Image */}
            <div className="relative w-full h-48 sm:h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {event.banner && !imageError ? (
                <img
                  src={event.banner}
                  alt={event.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Calendar className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
              
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-sm transition cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4 text-white">
                <div>
                  <span className="px-2.5 py-1 bg-indigo-600/90 text-white text-xs font-semibold rounded-md backdrop-blur-sm inline-block mb-1.5">
                    {event.category || "General"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold line-clamp-1">{event.title}</h3>
                </div>
                <div>{getStatusBadge(event.status)}</div>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Date & Time</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{formattedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Location</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Ticket Price</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {unitPrice > 0 ? `$${unitPrice}` : "Free"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Available Capacity</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{event.availableSeats} Seats</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Event Description
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {event.description}
                </p>
              </div>

              {/* Organizer Info & Bottom Actions */}
              <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400 gap-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> {event.organizerEmail}
                  </span>
                  {event.createdAt && (
                    <span>Created: {new Date(event.createdAt).toLocaleDateString()}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleBookTicketClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition cursor-pointer active:scale-95 shrink-0"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Ticket</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Modal 1: Attendee Login / Account Required Modal */}
          <AnimatePresence>
            {isLoginModalOpen && (
              <div className={subModalOverlayClass}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsLoginModalOpen(false)}
                  className={subModalBackdropClass}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center"
                >
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>

                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md">
                    <LockKeyhole size={30} />
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Attendee Account Required
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {!user
                      ? "Ticket booking is exclusively available for Attendee accounts. Please sign in as an attendee or create an attendee account to continue."
                      : `You are currently logged in as an ${userRole.toUpperCase()}. Tickets can only be booked by Attendee accounts.`}
                  </p>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginModalOpen(false);
                        router.push("/login");
                      }}
                      className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <LogIn size={16} />
                      <span>Log In as Attendee</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginModalOpen(false);
                        router.push("/register");
                      }}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <UserPlus size={16} />
                      <span>Create Attendee Account</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal 2: Attendee Confirmation Modal with Price */}
          <AnimatePresence>
            {isConfirmModalOpen && (
              <div className={subModalOverlayClass}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsConfirmModalOpen(false)}
                  className={subModalBackdropClass}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl"
                >
                  <button
                    type="button"
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>

                  {!isBookingSuccess ? (
                    <div>
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                          <Ticket size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Confirm Ticket Booking
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Please review your order details below
                          </p>
                        </div>
                      </div>

                      {/* Event Summary Card */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 mb-6 space-y-2">
                        <span className="px-2 py-0.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded uppercase tracking-wider">
                          {event.category || "General"}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                          {event.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-indigo-500" />
                            {formattedDate}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={13} className="text-indigo-500" />
                            {event.location}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Price Calculation */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800/40">
                          <div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Ticket Quantity</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Max {maxSeats} per booking</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(-1)}
                              disabled={ticketQuantity <= 1}
                              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-800 dark:text-slate-200 flex items-center justify-center transition cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-base font-bold text-slate-900 dark:text-white w-6 text-center">
                              {ticketQuantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(1)}
                              disabled={ticketQuantity >= maxSeats}
                              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-800 dark:text-slate-200 flex items-center justify-center transition cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 space-y-2">
                          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                            <span>Price per ticket:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {unitPrice > 0 ? `$${unitPrice.toFixed(2)}` : "Free"}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                            <span>Quantity:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">x{ticketQuantity}</span>
                          </div>
                          <div className="pt-2 border-t border-indigo-200/50 dark:border-indigo-800/50 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Total Price:</span>
                            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                              {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "Free"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Attendee Details */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center justify-between px-1">
                        <span>Attendee: <strong className="text-slate-700 dark:text-slate-200">{user?.name || user?.email}</strong></span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <Check size={12} /> Role: Attendee
                        </span>
                      </div>

                      {/* Submit Actions */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsConfirmModalOpen(false)}
                          className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmBooking}
                          disabled={isSubmitting}
                          className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span>Processing...</span>
                          ) : (
                            <>
                              <CreditCard size={16} />
                              <span>{totalPrice > 0 ? `Confirm & Pay ($${totalPrice.toFixed(2)})` : "Confirm Free Booking"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Booking Success State */
                    <div className="text-center py-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg">
                        <CheckCircle2 size={36} />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                        Booking Confirmed! 🎉
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        Your booking for <strong className="font-semibold text-slate-900 dark:text-white">{event.title}</strong> ({ticketQuantity} {ticketQuantity > 1 ? "tickets" : "ticket"}) has been successfully processed.
                      </p>
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsConfirmModalOpen(false);
                            onClose();
                            router.push("/dashboard/attendee/bookings");
                          }}
                          className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Ticket size={16} />
                          <span>View My Bookings</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
}
