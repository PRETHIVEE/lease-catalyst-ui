import NoDataFound from "@/components/common/NoDataFound";
import StatusChip, {
  type StatusChipVariant,
} from "@/components/common/StatusChip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type EvaluationRow = {
  id: number;
  evaluationPoint: string;
  dataCaptured: string;
  supportingEvidence: string;
  confidentScore: string | number;
  notes: string;
};

type EvaluationTableProps = {
  data: EvaluationRow[];
  isLoading: boolean;
};

const headerCellClass =
  "bg-[#ebf0f6] px-3 py-2.5 text-left text-[0.79rem] font-medium text-black border-r border-[#d8dee6] last:border-r-0";

const bodyCellClass =
  "bg-white px-3 py-3 align-top text-[0.78rem] text-[#3c3c3c] border-b border-[#e8e8e8] transition-colors group-hover:bg-[#cccccc30]";

const bodyRowClass = "group cursor-default";

const tableClass = "w-full table-fixed border-collapse";

const columns = [
  { key: "sno", width: "4%" },
  { key: "evaluationPoint", width: "24%" },
  { key: "dataCaptured", width: "10%" },
  { key: "confidence", width: "12%" },
  { key: "evidence", width: "23%" },
  { key: "notes", width: "15%" },
  { key: "customerNotes", width: "15%" },
] as const;

function TableColGroup() {
  return (
    <colgroup>
      {columns.map((col) => (
        <col key={col.key} style={{ width: col.width }} />
      ))}
    </colgroup>
  );
}

function formatConfidenceScore(
  score: string | number | null | undefined
): string {
  if (score == null || score === "") return "-";
  const str = String(score).trim();
  if (str.endsWith("%")) return str;
  const num = Number(str);
  if (!Number.isNaN(num) && num > 0 && num <= 1) {
    return `${Math.round(num * 100)}%`;
  }
  return `${str}%`;
}

function formatNotes(notes: string | null | undefined): string {
  if (notes == null || String(notes).trim() === "") return "-";
  return String(notes);
}

function getDataCapturedVariant(value: string): StatusChipVariant {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (normalized === "yes") return "success";
  if (normalized === "no") return "failed";
  return "pending";
}

const EvaluationTable = ({ data, isLoading }: EvaluationTableProps) => {
  if (isLoading) {
    return (
      <div className="mt-4 flex flex-col gap-1">
        <Skeleton className="h-[5rem] bg-[#e8f4e5] w-full" />
        <Skeleton className="h-[5rem] bg-[#e8f4e5] w-full" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="mt-3 rounded-sm bg-white py-10 shadow-card">
        <NoDataFound message="No data found" />
      </div>
    );
  }

  console.log("EvaluationTable data:", data);

  return (
    <div className="mt-3 w-full overflow-hidden rounded-sm bg-white shadow-card">
      <table className={tableClass}>
        <TableColGroup />
        <thead>
          <tr>
            <th className={cn(headerCellClass, "text-center")}>S.No</th>
            <th className={headerCellClass}>Evaluation Point</th>
            <th className={cn(headerCellClass, "text-center")}>
              Data Captured
            </th>
            <th className={cn(headerCellClass, "text-center")}>
              Confidence Score
            </th>
            <th className={headerCellClass}>Supporting Evidence</th>
            <th className={headerCellClass}>Reviewer Notes</th>
            <th className={headerCellClass}>Customer Notes</th>
          </tr>
        </thead>
      </table>

      <div
        className="max-h-[calc(100vh-14.5rem)] w-full overflow-y-auto [scrollbar-gutter:stable]"
        role="region"
        aria-label="Evaluation results"
      >
        <table className={tableClass}>
          <TableColGroup />
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className={bodyRowClass}>
                <td className={cn(bodyCellClass, "text-center")}>{row.id}</td>
                <td className={cn(bodyCellClass, "font-medium text-[#1f2937]")}>
                  {row.evaluationPoint}
                </td>
                <td className={cn(bodyCellClass, "text-center")}>
                  <div className="flex justify-center">
                    <StatusChip
                      variant={getDataCapturedVariant(row.dataCaptured)}
                      label={row.dataCaptured || "-"}
                      className="font-normal"
                    />
                  </div>
                </td>
                <td className={cn(bodyCellClass, "text-center")}>
                  {formatConfidenceScore(row.confidentScore)}
                </td>
                <td className={bodyCellClass}>
                  {row.supportingEvidence || "-"}
                </td>
                <td className={bodyCellClass}>{formatNotes(row.notes)}</td>
                <td className={bodyCellClass}>{formatNotes(row.notes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationTable;
