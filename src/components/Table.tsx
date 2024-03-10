import { ColumnT } from "@/app/types/types";
import React, { ReactNode } from "react";
import Spinner from "./Spinner";

interface Props {
  dataSource?: any[];
  columns?: ColumnT<any>[];
  expandedRows?: string[];
  expandedRowRender?: (row: any) => ReactNode;
  loading?: boolean;
}

function Table({
  dataSource,
  columns,
  expandedRows,
  expandedRowRender,
  loading = false,
}: Props) {
  return (
    <Spinner loading={loading}>
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
          {!dataSource || dataSource?.length <= 0 ? (
            <tr>
              <td
                height={120}
                colSpan={columns?.length}
                className="text-center text-gray-300"
              ></td>
            </tr>
          ) : (
            dataSource?.map((row, index) => (
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
            ))
          )}
          {/* {} */}
        </tbody>
      </table>
    </Spinner>
  );
}

export default Table;
