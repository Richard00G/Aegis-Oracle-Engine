"use client";

import {getContract} from "@/lib/contract";

export default function Controls() {
    
    const setPrice = async (price: number) => {
        const { mock, contract } = await getContract();

       const tx1 = await mock.setPrice(price * 1e8);
       await tx1.wait();

       const tx2 = await contract.getSafePrice();
       
    };
    
    return (
        <div className="bg-zinc-900 p-6 rounded-2x1 mt-6">
            
            <h2 className="mb-4 text-lg">Controls</h2>
            
          <div className="flex gap-4">
            <button
                onClick={() => setPrice(2100)} className="btn"> Set Price to $2000
            </button>
             <button
                onClick={() => setPrice(2200)} className="btn"> Set Price to $3000
            </button>
             <button
                onClick={() => setPrice(2300)} className="btn"> Set Price to $5000
            </button>
          </div>
        </div>

    )
}