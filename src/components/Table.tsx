import { ColumnT } from "@/app/types/types";
import React, { ReactNode } from "react";

interface Props {
  dataSource?: any[];
  columns?: ColumnT<any>[];
  expandedRows?: string[];
  expandedRowRender?: (row: any) => ReactNode;
}

function Table({
  dataSource,
  columns,
  expandedRows,
  expandedRowRender,
}: Props) {
  return (
    <table className="unstyledTable">
      <thead>
        <tr>
          {columns?.map((col, index) => (
            <th
              colSpan={col?.colSpan}
              style={{ width: col?.width }}
              key={index}
            >
              {col?.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource?.map((row, index) => (
          <React.Fragment key={row.id}>
            <tr
              style={{
                backgroundColor: row?.isEditable ? "#f5f4f2" : undefined,
              }}
            >
              {columns?.map((col) => (
                <td
                  colSpan={col?.colSpan}
                  className=""
                  key={col?.key || col?.dataIndex}
                >
                  {col?.render
                    ? col?.render(row[col?.dataIndex], row)
                    : row[col?.dataIndex]}
                </td>
              ))}
            </tr>
            {expandedRows?.includes(row?.id) && expandedRowRender && (
              <tr>
                <td colSpan={columns?.length}>{expandedRowRender(row)}</td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
