// components/ui/barcode-qr-preview.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Barcode as BarcodeIcon, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeQrPreviewProps {
  value: string;
  fileName: string;
}

export function BarcodeQrPreview({ value, fileName }: BarcodeQrPreviewProps) {
  const barcodeCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<"barcode" | "qr">("barcode");

  useEffect(() => {
    if (!value) return;

    // Draw barcode (Code128-style bars).
    // For production, replace this block with: JsBarcode(barcodeCanvasRef.current, value, { format: "CODE128" });
    const canvas = barcodeCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const width = 280;
        const height = 90;
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#0f172a";

        const digits = value.replace(/\D/g, "") || value;
        const barCount = Math.max(digits.length * 3, 30);
        const barWidth = (width - 20) / barCount;
        let x = 10;
        for (let i = 0; i < barCount; i++) {
          const seed = digits.charCodeAt(i % digits.length) || 50;
          const isBar = (seed + i) % 3 !== 0;
          const barHeight = isBar ? 60 : 40;
          if (isBar) {
            ctx.fillRect(x, 10, Math.max(barWidth * 0.6, 1.5), barHeight);
          }
          x += barWidth;
        }

        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(value, width / 2, 80);
      }
    }

    // Draw QR-style placeholder pattern.
    // For production, replace this block with the <QRCodeCanvas value={value} /> component from qrcode.react.
    const qrCanvas = qrCanvasRef.current;
    if (qrCanvas) {
      const ctx = qrCanvas.getContext("2d");
      if (ctx) {
        const size = 180;
        const grid = 18;
        const cell = size / grid;
        qrCanvas.width = size;
        qrCanvas.height = size;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#0f172a";

        let seed = 0;
        for (const ch of value) seed += ch.charCodeAt(0);

        for (let row = 0; row < grid; row++) {
          for (let col = 0; col < grid; col++) {
            const isCorner =
              (row < 4 && col < 4) || (row < 4 && col > grid - 5) || (row > grid - 5 && col < 4);
            const pseudo = (seed * (row + 1) * (col + 1)) % 5;
            if (isCorner ? (row % 4 !== 0 && col % 4 !== 0) : pseudo === 0) {
              ctx.fillRect(col * cell, row * cell, cell - 1, cell - 1);
            }
          }
        }
      }
    }
  }, [value]);

  function handleDownload(type: "barcode" | "qr") {
    const canvas = type === "barcode" ? barcodeCanvasRef.current : qrCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${fileName}-${type}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab("barcode")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "barcode" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarcodeIcon className="w-4 h-4" />
          Barcode
        </button>
        <button
          onClick={() => setActiveTab("qr")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "qr" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <QrCode className="w-4 h-4" />
          QR Code
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className={activeTab === "barcode" ? "block" : "hidden"}>
          <canvas ref={barcodeCanvasRef} className="rounded-lg border border-slate-200 bg-white" />
        </div>
        <div className={activeTab === "qr" ? "block" : "hidden"}>
          <canvas ref={qrCanvasRef} className="rounded-lg border border-slate-200 bg-white" />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload(activeTab)}
          className="border-slate-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Download {activeTab === "barcode" ? "Barcode" : "QR Code"}
        </Button>
      </div>
    </div>
  );
}