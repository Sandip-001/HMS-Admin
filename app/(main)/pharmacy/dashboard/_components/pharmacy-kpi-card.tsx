import { LucideIcon } from "lucide-react";

// app/admin/pharmacy/dashboard/_components/pharmacy-kpi-card.tsx
export function PharmacyKpiCard({
  icon: Icon,
  label,
  value,
  tint,
  suffix,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tint: "blue" | "emerald" | "amber" | "rose";
  suffix?: string;
}) {
  const gradients = {
    blue: "from-blue-500 to-indigo-600",
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-600",
    rose: "from-rose-500 to-pink-600",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[tint]} p-5 text-white shadow-lg`}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -right-2 h-20 w-20 rounded-full bg-white/10" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">
            {value}
            {suffix && <span className="ml-1 text-sm font-medium text-white/70">{suffix}</span>}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}