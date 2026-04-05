"use client";

import { motion } from "framer-motion";

export function AnimatedCard({ children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800"
    >
      {children}
    </motion.div>
  );
}