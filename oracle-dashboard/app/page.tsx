"use client";

import { useOracle } from "@/hooks/useOracle";
import { AnimatedCard } from "@/components/AnimatedCard";
import { motion } from "framer-motion";

export default function Home() {
  const { price, paused } = useOracle();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-10 text-green-400 text-center drop-shadow-[0_0_20px_#00ff88]">
        🛡️ Aegis Oracle Engine
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PRICE */}
        <AnimatedCard>
          <p className="text-green-400 drop-shadow-[0_0_20px_#00ff88]">TWAP Price</p>

          <motion.p
            key={price}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold text-green-400 drop-shadow-[0_0_15px_#00ff88]"
          >
            ${price || "..."}
          </motion.p>
        </AnimatedCard>

        {/* STATUS */}
        <AnimatedCard>
          <p className="text-sm text-gray-400">Status</p>

          <motion.p
            animate={{
              color: paused ? "#ff0000" : "#00ff88"
            }}
            className="text-red-500 animate-pulse drop-shadow-[0_0_20px_red]"
          >
            {paused ? "PAUSED 🚨" : "ACTIVE ✅"}
          </motion.p>
        </AnimatedCard>

      </div>
    </div>
  );
}