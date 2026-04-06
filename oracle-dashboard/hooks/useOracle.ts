"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { getContract } from "@/lib/contract";

export function useOracle() {
  const [price, setPrice] = useState("");
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    let oracle: any;

    const load = async () => {
      const contracts = await getContract();
      oracle = contracts.contract;

      const p = await oracle.lastGoodPrice();
      const isPaused = await oracle.paused();
      const value = Number(p) / 1e8;

      setPrice(formatUnits(p, 8));
      setPaused(isPaused);

      setHistory([{
        time: new Date().toLocaleTimeString(),
        price: value,
      },
    ]);

      // 🎯 EVENTOS
      oracle.on("PriceUpdated", (p: any) => {
        const value = Number(p) / 1e8;

        setPrice(value.toString());

        setHistory((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            price: value,
          },
        ]);
      });

      oracle.on("Paused", () => setPaused(true));
      oracle.on("Unpaused", () => setPaused(false));
    };

    load();

    const interval = setInterval(async () => {
      if (oracle) {
        const p = await oracle.lastGoodPrice();
        const value = Number(p) / 1e8;
        setPrice(formatUnits(p, 8));

        setHistory((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            price: value,
          },
        ]);
      }
  }   , 3000);

    return () => {
      clearInterval(interval);
      if (oracle) {
        oracle.removeAllListeners();
      }
    };
  }, []);

  return { price, paused, history };
}