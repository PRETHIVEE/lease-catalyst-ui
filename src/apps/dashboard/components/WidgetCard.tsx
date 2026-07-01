import { List, Clock, XCircle, CheckCircle2 } from "lucide-react";

export default function StatsBar({
  total = 0,
  running = 0,
  failed = 0,
  completed = 0,
}) {
  const stats = [
    {
      label: "Total",
      value: total,
      Icon: List,
      iconBg: "#E9EAEC",
      iconColor: "#5B6168",
      valueColor: "#1F2329",
      labelColor: "#6B7280",
    },
    {
      label: "Running",
      value: running,
      Icon: Clock,
      iconBg: "#FBE3C6",
      iconColor: "#D9822B",
      valueColor: "#1F2329",
      labelColor: "#C2700F",
    },
    {
      label: "Failed",
      value: failed,
      Icon: XCircle,
      iconBg: "#F6D7D7",
      iconColor: "#C23B3B",
      valueColor: "#1F2329",
      labelColor: "#A11F1F",
    },
    {
      label: "Completed",
      value: completed,
      Icon: CheckCircle2,
      iconBg: "#CFEBD9",
      iconColor: "#2FA360",
      valueColor: "#1F2329",
      labelColor: "#1E8A4C",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: "3.5rem",
        padding: "0.5rem 1.5rem",
        borderRadius: "0.2rem",
        background:
          "linear-gradient(90deg, transparent 0%, #e2f3e5 30%, #E2F3E5 100%)",
        // fontFamily:
        //   "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {stats.map(
        ({ label, value, Icon, iconBg, iconColor, valueColor, labelColor }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "0.625rem",
                background: iconBg,
                flexShrink: 0,
              }}
            >
              <Icon size={"1rem"} color={iconColor} strokeWidth={2.25} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.375rem",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: valueColor,
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: "0.84rem",
                  fontWeight: 500,
                  color: labelColor,
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
