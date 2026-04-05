"use client";

import { useEffect, useState } from "react";
import { contract } from "@/lib/contract";

export default function EventFeed() {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    contract.on("PriceUpdated", (p) => {
      setEvents((prev) => [`📊 Price: ${p}`, ...prev]);
    });

    contract.on("CircuitBreakerTriggered", (p) => {
      setEvents((prev) => [`🚨 BREAKER: ${p}`, ...prev]);
    });
  }, []);

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl mt-8">
      <h2 className="text-lg mb-4">📡 Events</h2>
      <ul className="text-sm space-y-2 max-h-40 overflow-y-auto">
        {events.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}