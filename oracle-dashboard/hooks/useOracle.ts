import { useEffect, useState } from "react";
import { contract } from "../lib/contract"; 
import { formatUnits } from "ethers";

export function useOracle() {
  const [price, setPrice] = useState("");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const load = async () => {
      const p = await contract.lastGoodPrice();
      const isPaused = await contract.paused();

      setPrice(formatUnits(p, 8)); // Asumiendo que el precio tiene 8 decimales
      setPaused(isPaused);
    };

    load();

    contract.on("PriceUpdated", (p) => {
      setPrice(p.toString());
    });

    contract.on("Paused", () => setPaused(true));
    contract.on("Unpaused", () => setPaused(false));
  }, []);

  return { price, paused };
}