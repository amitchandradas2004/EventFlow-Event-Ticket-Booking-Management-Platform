"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Minimize2,
  Maximize2,
  Trash2,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Ticket,
  DollarSign,
  Calendar,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";


const STARTER_PROMPTS = [
  {
    icon: Calendar,
    text: "Find upcoming events on EventFlow",
    category: "Events",
  },
  {
    icon: Ticket,
    text: "How do I buy & access event tickets?",
    category: "Booking",
  },
  {
    icon: Building2,
    text: "How to host & organize an event?",
    category: "Organizers",
  },
  {
    icon: DollarSign,
    text: "What are EventFlow pricing plans?",
    category: "Pricing",
  },
];

export default function AIChatBot() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load stored messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("eventflow_ai_chat_history");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Default initial welcome message
        setMessages([
          {
            id: "welcome-1",
            role: "assistant",
            content:
              "Hello! 👋 I'm **EventFlow AI Assistant**, powered by **Google Gemini**. \n\nHow can I help you today? You can ask me about live events, ticket booking, organizer setup, or platform features!",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
  }, []);

  // Save messages to localStorage when updated
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("eventflow_ai_chat_history", JSON.stringify(messages));
      } catch (e) {
        console.error("Error saving chat to localStorage:", e);
      }
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (overridePrompt) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!overridePrompt) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data.reply ||
          "Sorry, I didn't get a response. Please check your Gemini API key in the server configuration.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isError: !data.success,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "⚠️ **Network Error**: Unable to reach the server. Please check your connection and try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const resetState = [
      {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Chat history cleared! 🧹 How can I assist you with **EventFlow** today?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
    setMessages(resetState);
    localStorage.removeItem("eventflow_ai_chat_history");
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper parser for markdown text links & simple formatting
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Replace Markdown links [Text](/path) with clickable links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const linkText = match[1];
      const linkHref = match[2];
      const isInternal = linkHref.startsWith("/");

      if (isInternal) {
        parts.push(
          <Link
            key={match.index}
            href={linkHref}
            onClick={() => setIsMinimized(true)}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded transition-colors"
          >
            {linkText}
            <ChevronRight className="w-3 h-3 inline" />
          </Link>
        );
      } else {
        parts.push(
          <a
            key={match.index}
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {linkText}
            <ExternalLink className="w-3.5 h-3.5 inline" />
          </a>
        );
      }
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    const processFormattedText = (nodes) => {
      return nodes.map((node, i) => {
        if (typeof node !== "string") return node;

        // Process bold **text**
        const boldParts = node.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((subText, j) => {
          if (subText.startsWith("**") && subText.endsWith("**")) {
            return (
              <strong key={`${i}-${j}`} className="font-semibold text-gray-900 dark:text-gray-100">
                {subText.slice(2, -2)}
              </strong>
            );
          }
          return subText;
        });
      });
    };

    return (
      <div className="space-y-2 whitespace-pre-wrap break-words text-sm">
        {processFormattedText(parts)}
      </div>
    );
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="relative group flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 cursor-pointer border border-white/20"
              aria-label="Open AI Assistant"
            >
              <div className="relative">
                <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <span className="font-medium text-sm hidden sm:inline-block pr-1">
                EventFlow AI
              </span>
              <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Main Chat Drawer / Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "64px" : "600px",
            }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[420px] max-h-[85vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl ${
              isMinimized ? "shadow-lg" : ""
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0 select-none shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                  <Bot className="w-5 h-5 text-purple-200" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-900"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm tracking-wide">
                      EventFlow AI
                    </h3>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/20 text-purple-100 tracking-wider">
                      Gemini
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online & Ready to Help
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear Chat History"
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-purple-200 hover:text-white cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand Chat" : "Minimize Chat"}
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-purple-200 hover:text-white cursor-pointer"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Chat"
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-purple-200 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (Hidden when minimized) */}
            {!isMinimized && (
              <>
                {/* Chat Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-gray-950/50">
                  {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                      <motion.div
                        key={msg.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${
                          isUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            isUser
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                              : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/20"
                          }`}
                        >
                          {isUser ? "You" : <Bot className="w-4 h-4" />}
                        </div>

                        {/* Message Content Bubble */}
                        <div
                          className={`group relative max-w-[82%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                            isUser
                              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none"
                              : msg.isError
                              ? "bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-tl-none"
                              : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 text-gray-800 dark:text-gray-100 rounded-tl-none"
                          }`}
                        >
                          {renderFormattedContent(msg.content)}

                          <div
                            className={`flex items-center justify-between gap-2 mt-1.5 pt-1 text-[10px] ${
                              isUser
                                ? "text-indigo-200"
                                : "text-gray-400 border-t border-gray-100 dark:border-gray-700/40"
                            }`}
                          >
                            <span>{msg.timestamp}</span>

                            {!isUser && !msg.isError && (
                              <button
                                onClick={() => handleCopy(msg.content, index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 cursor-pointer"
                                title="Copy text"
                              >
                                {copiedIndex === index ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 animate-bounce" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.4s]"></span>
                        <span className="text-[11px] text-gray-400 font-medium ml-1.5">
                          Gemini is thinking...
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Starter Prompt Chips (shown if only 1 message exists) */}
                {messages.length <= 1 && (
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800/80">
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-2">
                      Suggested Questions:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {STARTER_PROMPTS.map((prompt, i) => {
                        const Icon = prompt.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(prompt.text)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/60 hover:border-indigo-500 dark:hover:border-indigo-500 text-left transition-all group cursor-pointer"
                          >
                            <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium line-clamp-1">
                              {prompt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input Controls */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 shrink-0"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask EventFlow AI anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
