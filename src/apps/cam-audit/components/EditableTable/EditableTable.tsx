import "./EditableTable.scss";

type ColumnAlign = "left" | "right" | "center";

export type EditableTableColumn = {
  key: string;
  label: string;
  type?: "checkbox" | "optional-number" | "number" | "text";
  readOnly?: boolean;
  align?: ColumnAlign;
  width?: string;
};

type EditableTableProps = {
  columns: EditableTableColumn[];
  rows: Record<string, unknown>[];
  onChange: (rowIndex: number, key: string, value: unknown) => void;
  readOnlyKeys?: string[];
};

function getColumnAlign(column: EditableTableColumn): ColumnAlign {
  if (column.align) return column.align;
  if (column.type === "number" || column.type === "optional-number") {
    return "right";
  }
  if (column.type === "checkbox") return "center";
  return "left";
}

function formatReadOnlyValue(value: unknown): string {
  if (value == null || value === "") return "—";
  return String(value);
}

export default function EditableTable({
  columns,
  rows,
  onChange,
  readOnlyKeys = [],
}: EditableTableProps) {
  return (
    <div className="editable-table">
      <table className="editable-table__table">
        <colgroup>
          {columns.map((column) => (
            <col
              key={column.key}
              style={column.width ? { width: column.width } : undefined}
            />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => {
              const align = getColumnAlign(column);
              return (
                <th
                  key={column.key}
                  className={`editable-table__header-cell editable-table__header-cell--${align}`}
                >
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="editable-table__row">
              {columns.map((column) => {
                const align = getColumnAlign(column);
                const isReadOnly =
                  readOnlyKeys.includes(column.key) || column.readOnly;
                const isCategory = column.key === "Category";

                return (
                  <td
                    key={column.key}
                    className={[
                      "editable-table__cell",
                      `editable-table__cell--${align}`,
                      isCategory && "editable-table__cell--category",
                      isReadOnly && "editable-table__cell--readonly",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isReadOnly ? (
                      formatReadOnlyValue(row[column.key])
                    ) : column.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        className="editable-table__checkbox"
                        checked={!!row[column.key]}
                        onChange={(e) =>
                          onChange(rowIndex, column.key, e.target.checked)
                        }
                        aria-label={`${column.label} for row ${rowIndex + 1}`}
                      />
                    ) : column.type === "optional-number" ? (
                      <input
                        type="number"
                        step="any"
                        className={`editable-table__input editable-table__input--number editable-table__input--${align}`}
                        value={(row[column.key] as number | null) ?? ""}
                        onChange={(e) =>
                          onChange(
                            rowIndex,
                            column.key,
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                          )
                        }
                      />
                    ) : column.type === "number" ? (
                      <input
                        type="number"
                        step="any"
                        className={`editable-table__input editable-table__input--number editable-table__input--${align}`}
                        value={(row[column.key] as number | string) ?? ""}
                        onChange={(e) =>
                          onChange(
                            rowIndex,
                            column.key,
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                          )
                        }
                      />
                    ) : (
                      <input
                        className={`editable-table__input editable-table__input--${align}`}
                        value={(row[column.key] as string) ?? ""}
                        onChange={(e) =>
                          onChange(rowIndex, column.key, e.target.value)
                        }
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
