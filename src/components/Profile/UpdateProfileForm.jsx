"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Fieldset,
  Form,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { Camera, Loader2, Save, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { updateUserInfo } from "@/lib/actions/user";

export default function UpdateProfileForm({
  user,
  onClose,
  isLoading = false,
  inModal = false,
}) {
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [loading, setLoading] = useState(isLoading);

  const isBlocked = user?.isBlocked === true || user?.status === "blocked";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) {
      toast.error("Your account is blocked by an administrator. Profile updates are disabled.");
      return;
    }
    if (user?.email?.toLowerCase() === "demouser@gmail.com") {
      toast.error("Demo account profile changes are disabled!");
      return;
    }

    setLoading(true);
    try {
      // Pass email along with name and image
      await updateUserInfo({
        email: user?.email,
        name,
        image,
      });

      toast.success("Profile updated successfully!");
      if (onClose) onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Update Profile Information
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Change your public display name and avatar picture URL.
        </p>
      </div>

      {isBlocked && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
          <span>⚠️ Your account is currently blocked by an administrator. Profile editing is disabled.</span>
        </div>
      )}

      <Form onSubmit={handleSubmit} className="space-y-5">
        <Fieldset.Group className="space-y-4">
          {/* FULL NAME */}
          <div>
            <TextField isRequired name="name" type="text">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                Full Name
              </Label>
              <InputGroup className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <InputGroup.Prefix className="text-slate-400 dark:text-slate-500 pl-3.5">
                  <UserIcon size={18} />
                </InputGroup.Prefix>
                <InputGroup.Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="py-2.5"
                />
              </InputGroup>
            </TextField>
          </div>

          {/* IMAGE URL */}
          <div>
            <TextField isRequired name="image" type="url">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                Image URL
              </Label>
              <InputGroup className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <InputGroup.Prefix className="text-slate-400 dark:text-slate-500 pl-3.5">
                  <Camera size={18} />
                </InputGroup.Prefix>
                <InputGroup.Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="py-2.5"
                />
              </InputGroup>
            </TextField>
          </div>
        </Fieldset.Group>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
          )}
          <motion.div
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <Button
              type="submit"
              isDisabled={loading}
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Profile</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </Form>
    </div>
  );

  if (inModal) {
    return formContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-xl"
    >
      {formContent}
    </motion.div>
  );
}