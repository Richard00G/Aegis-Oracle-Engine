"use client";

import { useOracle } from "@/hooks/useOracle";
import { AnimatedCard } from "@/components/AnimatedCard";
import Controls from "@/components/Controls";
import Chart from "@/components/Charts";

export default function Home() {
  const { price, paused, history } = useOracle();

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold text-green-400 mb-8 text-center">
        🛡️ Aegis Trading Panel
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="col-span-2">
          <Chart data={history} />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-6">

          <AnimatedCard>
            <p className="text-gray-400">TWAP Price</p>
            <p className="text-4xl text-green-400">${price}</p>
          </AnimatedCard>

          <AnimatedCard>
            <p>Status</p>
            <p className={paused ? "text-red-500" : "text-green-400"}>
              {paused ? "PAUSED 🚨" : "ACTIVE"}
            </p>
          </AnimatedCard>

          <Controls />

        </div>
      </div>
    </div>
  );
}