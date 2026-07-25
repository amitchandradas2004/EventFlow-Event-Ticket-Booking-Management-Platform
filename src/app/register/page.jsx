"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Fieldset,
  Form,
  InputGroup,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { motion } from "framer-motion";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsEyeSlash } from "react-icons/bs";
import { FaCamera, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const user = Object.fromEntries(formData.entries());

      const { data, error } = await authClient.signUp.email({
        name: user?.name,
        email: user?.email,
        password: user?.password,
        role: user?.role || "attendee",
        image: user?.image,
        isBlocked: false,
        isPremium: false,
      });

      if (data) {
        toast.success("Account created successfully! Now you can login");
        router.push("/login");
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
    const data = await authClient.signIn.social({
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
        <motion.h1 variants={fadeUp} className="text-2xl font-bold text-center">
          Create your account
        </motion.h1>
        <Form onSubmit={onSubmit}>
          <Fieldset.Group className="space-y-4">
            {/* NAME */}
            <motion.div variants={fadeUp}>
              <TextField isRequired name="name" type="text">
                <Label>Name</Label>
                <InputGroup className="rounded-full overflow-hidden">
                  <InputGroup.Prefix>
                    <FaUser />
                  </InputGroup.Prefix>
                  <InputGroup.Input placeholder="John Doe" />
                </InputGroup>
              </TextField>
            </motion.div>

            {/* EMAIL */}
            <motion.div variants={fadeUp}>
              <TextField isRequired name="email" type="email">
                <Label>Email</Label>
                <InputGroup className="rounded-full overflow-hidden">
                  <InputGroup.Prefix>
                    <FaEnvelope />
                  </InputGroup.Prefix>
                  <InputGroup.Input placeholder="john@example.com" />
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

            {/* ROLE */}
            <motion.div variants={fadeUp}>
              <Select
                isRequired
                name="role"
                placeholder="Select one"
                onChange={(value) => setRole(value)}
              >
                <Label>Signup As</Label>

                <Select.Trigger className="rounded-full">
                  <span className="mr-2">👤</span>
                  <Select.Value />
                </Select.Trigger>

                <Select.Popover className="rounded-3xl">
                  <ListBox>
                    <ListBox.Item id="attendee">Attendee</ListBox.Item>
                    <ListBox.Item id="organizer">Organizer</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </motion.div>

            {/* IMAGE */}
            <motion.div variants={fadeUp}>
              <TextField isRequired name="image" type="url">
                <Label>Image</Label>
                <InputGroup className="rounded-full overflow-hidden">
                  <InputGroup.Prefix>
                    <FaCamera />
                  </InputGroup.Prefix>
                  <InputGroup.Input placeholder="https://example.com/image.jpg" />
                </InputGroup>
              </TextField>
            </motion.div>
          </Fieldset.Group>

          {/* BUTTON */}
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
                  Signing up...
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </motion.div>
        </Form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        ></motion.div>
        {/* OR DIVIDER (MATCH SIGNUP STYLE) */}
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
          Already have an account?{" "}
          <Link href="/login" className="text-red-500">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
