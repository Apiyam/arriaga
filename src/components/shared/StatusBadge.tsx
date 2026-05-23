type StatusBadgeProps = {
  status?: number | null;
  activeLabel?: string;
  inactiveLabel?: string;
};

export function StatusBadge({
  status,
  activeLabel = "ACTIVO",
  inactiveLabel = "INACTIVO",
}: StatusBadgeProps) {
  const active = status === 1;
  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
        active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
