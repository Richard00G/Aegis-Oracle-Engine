"use client";

import { useEffect, useState } from "react";
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

      setPrice(p);
      setPaused(isPaused);

      setHistory([{
        time: new Date().toLocaleTimeString(),
        price: p,
      },
    ]);

      // 🎯 EVENTOS
      oracle.on("PriceUpdated", (p: any) => {

        setPrice(p);

        setHistory((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            price: p,
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
        setPrice(p);

        setHistory((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            price: p,
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