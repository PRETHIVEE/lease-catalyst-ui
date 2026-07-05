import { useEffect, useState, type CSSProperties } from "react";
import "./CamStats.scss";
import CamReconciliationAPI from "@/api/cam-reconciliation";
import { Skeleton } from "@mui/material";

type WidgetTone = "teal" | "green" | "red" | "amber";

type WidgetData = {
  key: string;
  label: string;
  value: number;
  display_value: string;
  subtitle: string;
  tone: WidgetTone;
  show_progress: boolean;
  progress_pct: number | null;
};

const TONE_STYLES: Record<
  WidgetTone,
  { accentColor: string; valueColor: string }
> = {
  teal: { accentColor: "#267d7d", valueColor: "#1a202c" },
  green: { accentColor: "#3e7b44", valueColor: "#3e7b44" },
  red: { accentColor: "#a63e3e", valueColor: "#a63e3e" },
  amber: { accentColor: "#a67c3e", valueColor: "#a67c3e" },
};

const sampleWidgetData: WidgetData[] = [
  {
    key: "total_current_cam",
    label: "Total Current CAM",
    value: 238288.54,
    display_value: "$238,288.54",
    subtitle: "8 expense categories",
    tone: "teal",
    show_progress: false,
    progress_pct: null,
  },
  {
    key: "total_allowable_cam",
    label: "Total Allowable CAM",
    value: 225182.68,
    display_value: "$225,182.68",
    subtitle: "Per lease cap rules",
    tone: "green",
    show_progress: false,
    progress_pct: null,
  },
  {
    key: "total_variance",
    label: "Total Variance",
    value: 13105.86,
    display_value: "$13,105.86",
    subtitle: "Over allowable amount",
    tone: "red",
    show_progress: false,
    progress_pct: null,
  },
  {
    key: "base_year",
    label: "Base Year",
    value: 2024,
    display_value: "2024",
    subtitle: "Manual entry",
    tone: "teal",
    show_progress: false,
    progress_pct: null,
  },
  {
    key: "base_year_total",
    label: "Base Year Total",
    value: 5003,
    display_value: "$5,003",
    subtitle: "Manual entry",
    tone: "teal",
    show_progress: false,
    progress_pct: null,
  },
  {
    key: "calculated_balance",
    label: "Calculated Balance",
    value: 151983.59,
    display_value: "$151,983,65.59",
    subtitle: "Grand total reconciliation",
    tone: "green",
    show_progress: false,
    progress_pct: null,
  },
];

const CamStats = ({
  auditId,
  triggerWidgetsFetch,
}: {
  auditId: string;
  triggerWidgetsFetch: number;
}) => {
  const [widgetData, setWidgetData] = useState<any[]>(sampleWidgetData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    CamReconciliationAPI.getWidgets(auditId)
      .then((response) => {
        setWidgetData(response?.data?.widgets || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auditId, triggerWidgetsFetch]);

  return (
    <div className="cam-stats mt-2.5" aria-label="CAM audit statistics">
      {widgetData.map((widget) => {
        const { accentColor, valueColor } = TONE_STYLES[widget.tone];

        return (
          <article
            key={widget.key}
            className="cam-stats__card shadow-card"
            style={{ "--cam-stats-accent": accentColor } as CSSProperties}
          >
            <h3 className="cam-stats__title">{widget.label}</h3>
            <p className="cam-stats__value" style={{ color: valueColor }}>
              {loading ? (
                <Skeleton variant="text" width={100} height={24} />
              ) : (
                widget.display_value
              )}
            </p>
            {widget.show_progress && widget.progress_pct !== null ? (
              loading ? (
                <Skeleton variant="text" width={100} height={24} />
              ) : (
                <div
                  className="cam-stats__progress"
                  role="progressbar"
                  aria-valuenow={widget.progress_pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${widget.label} ${widget.progress_pct}%`}
                >
                  <span
                    className="cam-stats__progress-fill"
                    style={{ width: `${widget.progress_pct}%` }}
                  />
                </div>
              )
            ) : (
              <p className="cam-stats__subtitle">{widget.subtitle}</p>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default CamStats;
