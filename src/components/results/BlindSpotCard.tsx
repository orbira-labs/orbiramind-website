"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import type { BlindSpot } from "@/lib/types";

interface BlindSpotCardProps {
  blindSpots: BlindSpot[];
}

export function BlindSpotCard({ blindSpots }: BlindSpotCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Kör Noktalar</h3>
          <p className="text-sm text-gray-500">Danışanın farkında olmadığı dinamikler</p>
        </div>
      </div>

      <div className="space-y-3">
        {blindSpots.map((spot, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className={clsx(
                "rounded-xl border transition-all duration-200",
                isExpanded
                  ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
                  : "bg-white border-gray-200 hover:border-purple-200"
              )}
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-gray-900">{spot.title}</span>
                <ChevronDown
                  className={clsx(
                    "h-5 w-5 text-gray-400 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed">{spot.insight}</p>
                  <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg border border-purple-100">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Koç İçin İpucu</span>
                      <p className="text-sm text-purple-800 mt-1">{spot.coach_tip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
