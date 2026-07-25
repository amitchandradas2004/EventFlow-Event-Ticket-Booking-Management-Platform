"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Fieldset,
  Form,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { motion } from "framer-motion";
import { Eye, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BsEyeSlash } from "react-icons/bs";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDemoFill = () => {
    setEmail("demouser@gmail.com");
    setPassword("demouser1234");
    toast.success("Demo credentials filled!");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const user = Object.fromEntries(formData.entries());
      const emailToUse = user.email || email;
      const passwordToUse = user.password || password;

      const { data, error } = await authClient.signIn.email({
        email: emailToUse,
        password: passwordToUse,
      });
      if (data) {
        toast.success("Logged in successfully!");
        router.push("/");
      }
      if (error) {
        toast.error(error?.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      isBlocked: false,
      isPremium: false,
    });
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen flex items-center justify-center px-4
      bg-linear-to-br from-slate-100 via-indigo-100 to-purple-200
      dark:from-slate-950 dark:via-slate-900 dark:to-black py-20"
    >
      {/* CARD */}
      <motion.div
        variants={fadeUp}
        className="w-full max-w-md p-6 rounded-2xl shadow-2xl
        bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl
        border border-white/30 dark:border-slate-700"
      >
        {/* TITLE */}
        <motion.h1 variants={fadeUp} className="text-2xl font-bold text-center mb-6">
          Login to your account
        </motion.h1>

        <Form onSubmit={onSubmit}>
          <Fieldset.Group className="space-y-4">
            {/* EMAIL */}
            <motion.div variants={fadeUp}>
              <TextField isRequired name="email" type="email">
                <Label>Email</Label>
                <InputGroup className="rounded-full overflow-hidden">
                  <InputGroup.Prefix>
                    <FaEnvelope />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </InputGroup>
              </TextField>
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={fadeUp}>
              <TextField isRequired name="password" type="password">
                <Label>Password</Label>
                <InputGroup className="rounded-full overflow-hidden flex items-center">
                  <InputGroup.Prefix className="pl-3.5 pr-1 text-slate-400">
                    <FaLock />
                  </InputGroup.Prefix>

                  <InputGroup.Input
                    type={isVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pr-5"
                  />

                  <InputGroup.Suffix
                    onClick={() => setIsVisible(!isVisible)}
                    className="pr-5 sm:pr-6 pl-2 shrink-0 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 cursor-pointer transition z-10 flex items-center justify-center select-none"
                  >
                    {isVisible ? <BsEyeSlash size={18} /> : <Eye size={18} />}
                  </InputGroup.Suffix>
                </InputGroup>
              </TextField>
            </motion.div>
          </Fieldset.Group>

          {/* LOGIN SUBMIT BUTTON */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <Button
              type="submit"
              isDisabled={loading}
              className="w-full mt-5 bg-indigo-600 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </motion.div>

          {/* DEMO USER QUICK FILL BUTTON */}
          <motion.div variants={fadeUp} className="mt-3">
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>Demo User (Attendee)</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/50 group-hover:bg-indigo-600 group-hover:text-white transition">
                Auto Fill
              </span>
            </button>
          </motion.div>
        </Form>

        {/* OR DIVIDER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-500 my-4">
            <motion.div
              className="flex-1 h-px bg-gray-300"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            <span className="whitespace-nowrap">OR CONTINUE WITH</span>

            <motion.div
              className="flex-1 h-px bg-gray-300"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleGoogleSignIn}
              className="w-full rounded-full border hover:bg-indigo-600 transition"
            >
              <FcGoogle size={20} />
              Continue with Google
            </Button>
          </motion.div>
        </motion.div>

        {/* FOOTER */}
        <motion.p variants={fadeUp} className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-red-500">
            Register
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
