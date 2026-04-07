"use client";

import { Eye, Lightbulb } from "lucide-react";
import type { BlindSpot } from "@/lib/types";

interface BlindSpotCardProps {
  blindSpots: BlindSpot[];
}

export function BlindSpotCard({ blindSpots }: BlindSpotCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Kör Noktalar</h3>
          <p className="text-sm text-gray-500">Danışanın farkında olmadığı dinamikler</p>
        </div>
      </div>

      <div className="grid gap-5">
        {blindSpots.map((spot, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-transparent">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                  {idx + 1}
                </span>
                <h4 className="font-semibold text-gray-900">{spot.title}</h4>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-gray-700 leading-relaxed">{spot.insight}</p>
              
              <div className="flex gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    Koç İçin İpucu
                  </span>
                  <p className="text-sm text-amber-900 mt-1 leading-relaxed">{spot.coach_tip}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
