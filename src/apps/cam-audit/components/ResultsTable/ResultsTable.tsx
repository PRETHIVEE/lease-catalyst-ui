import StatusChip, {
  type StatusChipVariant,
} from "@/components/common/StatusChip";
import "../EditableTable/EditableTable.scss";
import "./ResultsTable.scss";

type ColumnAlign = "left" | "right" | "center";

export type ResultsTableColumn = {
  key: string;
  label: string;
  type?: "checkbox" | "optional-number" | "number" | "text" | "status";
  align?: ColumnAlign;
  width?: string;
  editable?: boolean;
};
type ResultsTableProps = {
  columns: ResultsTableColumn[];
  rows: Record<string, unknown>[];
  onChange?: (rowIndex: number, key: string, value: unknown) => void;
};

function getColumnAlign(column: ResultsTableColumn): ColumnAlign {
  if (column.align) return column.align;
  if (column.type === "number" || column.type === "optional-number") {
    return "right";
  }
  if (column.type === "checkbox" || column.type === "status") return "center";
  return "left";
}

function getStatusChipVariant(value: unknown): StatusChipVariant {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (normalized === "pass") return "success";
  if (normalized === "fail") return "failed";
  return "pending";
}

function getStatusLabel(value: unknown): string {
  if (value == null || value === "") return "—";
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "pass") return "Pass";
  if (normalized === "fail") return "Fail";
  return String(value);
}

function formatCellValue(value: unknown): string {
  if (value == null || value === "") return "—";
  return String(value);
}

function isConsolidatedSummaryRow(row: Record<string, unknown>): boolean {
  // return String(row.Type ?? "").trim() === "Consolidated Summary";
  return (
    String(row.Type ?? "").trim() === "Consolidated Summary" ||
    String(row.Category ?? "").trim() === "GRAND TOTAL"
  );
}

export default function ResultsTable({
  columns,
  rows,
  onChange,
}: ResultsTableProps) {
  return (
    <div className="results-table">
      <table className="editable-table__table">
        <colgroup>
          {columns.map((column, index) => (
            <col
              key={column.key || `${column.label}-${index}`}
              style={
                column.width
                  ? { minWidth: column.width, width: column.width }
                  : { minWidth: "5rem" }
              }
            />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column, index) => {
              const align = getColumnAlign(column);
              return (
                <th
                  key={column.key || `${column.label}-${index}`}
                  className={`editable-table__header-cell editable-table__header-cell--${align}`}
                >
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const isSummaryRow = isConsolidatedSummaryRow(row);

            return (
              <tr
                key={rowIndex}
                className={[
                  "editable-table__row",
                  isSummaryRow && "results-table__row--summary",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {columns.map((column, columnIndex) => {
                  const align = getColumnAlign(column);
                  const isCategory = column.key === "Category";
                  const isEditable = column.editable;
                  const value = row[column.key];
                  const cellKey =
                    column.key || `${column.label}-${columnIndex}`;

                  return (
                    <td
                      key={cellKey}
                      className={[
                        "editable-table__cell",
                        `editable-table__cell--${align}`,
                        isCategory && "editable-table__cell--category",
                        !isEditable && "editable-table__cell--readonly",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {isEditable ? (
                        <input
                          className={`editable-table__input editable-table__input--${align}`}
                          value={(value as string) ?? ""}
                          onChange={(e) =>
                            onChange?.(rowIndex, column.key, e.target.value)
                          }
                        />
                      ) : column.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          className="editable-table__checkbox"
                          checked={!!value}
                          disabled
                          aria-label={`${column.label} for row ${rowIndex + 1}`}
                        />
                      ) : column.type === "status" ? (
                        value == null || value === "" ? (
                          "—"
                        ) : (
                          <StatusChip
                            variant={getStatusChipVariant(value)}
                            label={getStatusLabel(value)}
                            className={
                              isSummaryRow ? "font-semibold" : "font-normal"
                            }
                          />
                        )
                      ) : (
                        formatCellValue(value)
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
