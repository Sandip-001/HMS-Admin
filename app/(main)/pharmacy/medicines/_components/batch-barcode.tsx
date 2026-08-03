
"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

function generateBarPattern(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) % 997;
  const bars: number[] = [];
  let seed = hash || 1;
  for (let i = 0; i < 40; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    bars.push(1 + (seed % 3));
  }
  return bars;
}

export function BatchBarcode({ code }: { code: string }) {
  const bars = generateBarPattern(code);
  const width = bars.length * 3;

  function handleDownload() {
    const svg = document.getElementById(`barcode-${code}`);
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-${code}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg id={`barcode-${code}`} width={width} height="42" viewBox={`0 0 ${width} 42`}>
        <rect width={width} height="42" fill="white" />
        {bars.map((w, i) => {
          const x = bars.slice(0, i).reduce((sum, b) => sum + b * 3, 0);
          return i % 2 === 0 ? <rect key={i} x={x} y={0} width={w * 3} height={32} fill="#1e293b" /> : null;
        })}
        <text x={width / 2} y="41" textAnchor="middle" fontSize="8" fill="#475569">{code}</text>
      </svg>
      <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={handleDownload}>
        <Download className="h-3 w-3" /> Download
      </Button>
    </div>
  );
}