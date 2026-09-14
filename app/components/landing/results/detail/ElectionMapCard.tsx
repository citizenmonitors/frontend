"use client";

import React, { useMemo, useRef, useState } from "react";
import { Add, Minus } from "iconsax-react";
import formatNumber from "@/app/utils/formatNumber";
import { MapRegion } from "@/app/types/irevCollation";

type ElectionMapCardProps = {
  regions: MapRegion[];
  legend: Array<{ party: string; label: string; color: string }>;
};

type RegionBreakdown = Array<{
  party: string;
  color: string;
  share: number;
  votes: number;
}>;

function mockBreakdown(region: MapRegion): RegionBreakdown {
  if (region.party === "A") {
    return [
      { party: "A", color: "#64CC46", share: 55, votes: 21171 },
      { party: "APC", color: "#1B3A6B", share: 41, votes: 15919 },
      { party: "ADC", color: "#2E7D32", share: 2, votes: 757 },
      { party: "Oth...", color: "#98A2B3", share: 1, votes: 544 },
    ];
  }
  return [
    { party: "APC", color: "#1B3A6B", share: 56, votes: 9937 },
    { party: "A", color: "#64CC46", share: 42, votes: 7479 },
    { party: "ADC", color: "#2E7D32", share: 1, votes: 213 },
    { party: "Oth...", color: "#98A2B3", share: 1, votes: 256 },
  ];
}

function pathBounds(path: string) {
  const nums = path.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, maxX, minY, maxY, width: maxX - minX || 1, height: maxY - minY || 1 };
}

function centroid(path: string) {
  const { minX, maxX, minY, maxY } = pathBounds(path);
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

/** Mini LGA silhouette inside a light box — Dataphyte hover-card detail */
function RegionThumb({ region }: { region: MapRegion }) {
  const b = pathBounds(region.path);
  const pad = 4;
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#E8F1FF] ring-1 ring-[#D6E4FF]">
      <svg
        viewBox={`${b.minX - pad} ${b.minY - pad} ${b.width + pad * 2} ${b.height + pad * 2}`}
        className="h-7 w-7"
        aria-hidden
      >
        <path d={region.path} fill={region.color} />
      </svg>
    </span>
  );
}

export default function ElectionMapCard({
  regions,
  legend,
}: ElectionMapCardProps) {
  const [zoom, setZoom] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [cardPos, setCardPos] = useState({ x: 24, y: 24 });
  const [pinBottom, setPinBottom] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const active = useMemo(
    () => regions.find((r) => r.id === activeId) || null,
    [regions, activeId]
  );
  const breakdown = active ? mockBreakdown(active) : [];

  function placeCard(clientX: number, clientY: number) {
    const el = mapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cardW = 280;
    const cardH = 260;
    let x = clientX - rect.left + 14;
    let y = clientY - rect.top + 14;
    if (x + cardW > rect.width - 8) x = clientX - rect.left - cardW - 14;
    if (y + cardH > rect.height - 8) y = clientY - rect.top - cardH - 8;
    setCardPos({
      x: Math.max(8, x),
      y: Math.max(8, y),
    });
  }

  function selectRegion(
    regionId: string,
    clientX: number,
    clientY: number,
    options?: { pin?: boolean }
  ) {
    setActiveId(regionId);
    setPinBottom(Boolean(options?.pin));
    if (!options?.pin) placeCard(clientX, clientY);
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
      <h3 className="text-base font-semibold text-gray-900 md:text-lg">
        Explore result on map
      </h3>
      <div className="mt-3 flex flex-wrap gap-4">
        {legend.map((item) => (
          <span
            key={item.party}
            className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-gray-500"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>

      <div
        ref={mapRef}
        className="relative mt-4 overflow-hidden rounded-xl bg-[#F2F4F7]"
        onMouseLeave={() => {
          if (!pinBottom) setActiveId(null);
        }}
      >
        <div className="absolute left-3 top-3 z-10 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.15, 1.8))}
            className="grid h-11 w-11 place-content-center border-b border-gray-100 text-gray-700 transition-colors hover:bg-gray-50"
            aria-label="Zoom in"
          >
            <Add size={18} />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.8))}
            className="grid h-11 w-11 place-content-center text-gray-700 transition-colors hover:bg-gray-50"
            aria-label="Zoom out"
          >
            <Minus size={18} />
          </button>
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center p-4 sm:min-h-[320px] sm:p-5 md:min-h-[420px] md:p-8">
          <svg
            viewBox="0 0 320 300"
            className="h-auto w-full max-w-lg origin-center transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            {regions.map((region) => {
              const c = centroid(region.path);
              const isActive = activeId === region.id;
              const dimmed = activeId != null && !isActive;
              return (
                <g
                  key={region.id}
                  onMouseEnter={(e) => {
                    selectRegion(region.id, e.clientX, e.clientY);
                  }}
                  onMouseMove={(e) => {
                    if (!pinBottom) placeCard(e.clientX, e.clientY);
                  }}
                  onClick={(e) => {
                    // Touch / click: pin card to bottom so it stays readable
                    const isTouch =
                      "ontouchstart" in window || navigator.maxTouchPoints > 0;
                    if (isTouch || window.matchMedia("(pointer: coarse)").matches) {
                      selectRegion(region.id, e.clientX, e.clientY, {
                        pin: true,
                      });
                    } else if (activeId === region.id) {
                      setActiveId(null);
                      setPinBottom(false);
                    } else {
                      selectRegion(region.id, e.clientX, e.clientY);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <path
                    d={region.path}
                    fill={region.color}
                    stroke="#fff"
                    strokeWidth={isActive ? 2.5 : 1.75}
                    opacity={dimmed ? 0.45 : isActive ? 1 : 0.92}
                    className="transition-[opacity,filter] duration-150"
                    style={{
                      filter: isActive
                        ? "brightness(1.08) saturate(1.15)"
                        : undefined,
                    }}
                  />
                  <text
                    x={c.x}
                    y={c.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none fill-white text-[7.5px] font-semibold"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {active ? (
            <div
              className={`z-20 w-[min(100%-1.5rem,280px)] rounded-xl border border-gray-100 bg-white p-3.5 shadow-[0_8px_30px_rgba(16,24,40,0.12)] ${
                pinBottom
                  ? "pointer-events-auto absolute inset-x-3 bottom-3 mx-auto sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
                  : "pointer-events-none absolute"
              }`}
              style={pinBottom ? undefined : { left: cardPos.x, top: cardPos.y }}
              role="tooltip"
            >
              <div className="mb-3 flex items-start gap-2.5">
                <RegionThumb region={active} />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {active.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Won by {active.party}
                  </p>
                </div>
                {pinBottom ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(null);
                      setPinBottom(false);
                    }}
                    className="grid h-11 w-11 shrink-0 place-content-center rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                    aria-label="Dismiss map details"
                  >
                    ×
                  </button>
                ) : null}
              </div>

              <ul className="grid gap-3">
                {breakdown.map((row) => (
                  <li key={row.party} className="grid gap-1.5">
                    <div className="flex min-w-0 items-center gap-2 text-xs">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="w-10 shrink-0 font-medium text-gray-700">
                        {row.party}
                      </span>
                      <span className="w-8 shrink-0 tabular-nums text-gray-500">
                        {row.share}%
                      </span>
                      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.share}%`,
                            backgroundColor: row.color,
                          }}
                        />
                      </div>
                      <span className="min-w-0 shrink-0 text-right font-semibold tabular-nums text-gray-900 sm:w-12">
                        {formatNumber.commas(row.votes)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 border-t border-gray-100 pt-2.5">
                <p className="text-[10px] text-gray-400">
                  Last updated: Wed Aug 19, 2026 - 07:35
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
