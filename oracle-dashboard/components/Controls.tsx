"use client";

import { useState } from "react";
import { getContract } from "@/lib/contract";
import { parseUnits } from "ethers";

export default function Controls() {
  const [status, setStatus] = useState("");
  const [price, setPriceState] = useState<string>("");

  const setPrice = async (priceInput: number) => {
    const { mock, mock2, mock3, contract } = await getContract();

    try {
      setStatus("⏳ Updating price...");

      // 🧱 1. write
      await Promise.all([
        mock.setPrice(parseUnits(priceInput.toString(), 8)),
        mock2.setPrice(parseUnits(priceInput.toString(), 8)),
        mock3.setPrice(parseUnits(priceInput.toString(), 8)),
      ]);

      const tx = await contract.getSafePrice();


      // 🔍 2. read (puede fallar)
      try {
        const preview = await contract.previewPrice();

        setPriceState(preview.toString());
        setStatus("✅ Price updated");
      } catch (err: any) {
        console.log("Preview error:", err);

        if (err.reason?.includes("Oracles mismatch")) {
          setStatus("⚠️ Oracles mismatch");
          setPriceState("N/A");
        } else if (err.reason?.includes("Deviation too high")) {
          setStatus("📉 Deviation too high");
          setPriceState("N/A");
        } else if (err.reason?.includes("Protocol paused")) {
          setStatus("🛑 Protocol paused");
          setPriceState("N/A");
        } else {
          setStatus("❌ Unknown error");
          setPriceState("N/A");
        }
      }

    } catch (err) {
      console.error("TX error:", err);
      setStatus("❌ Transaction failed");
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl mt-6">
      <h2 className="mb-4 text-lg">Controls</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setPrice(2000)}
          className="btn"
        >
          Set Price to $2000
        </button>

        <button
          onClick={() => setPrice(2200)}
          className="btn"
        >
          Set Price to $2200
        </button>

        <button
          onClick={() => setPrice(5000)}
          className="btn"
        >
          Set Price to $5000
        </button>
      </div>

      {/* 🧠 Estado */}
      <div className="text-sm text-zinc-400">
        <p>Status: {status}</p>
        <p>Preview Price: {price}</p>
      </div>
    </div>
  );
}