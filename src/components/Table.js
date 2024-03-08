import React, { useEffect, useState } from "react";

function Table({ dataSource, columns }) {
  return (
    <table className="unstyledTable">
      <thead>
        <tr>
          {columns?.map((col, index) => (
            <th style={{ width: col?.width }} key={index}>
              {col?.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource?.map((row, index) => (
          <>
            <tr
              key={index}
              style={{ backgroundColor: row?.isEditable && "#f5f4f2" }}
            >
              {columns?.map((col) => (
                <td className="" key={col?.key || col?.dataIndex}>
                  {col?.render
                    ? col?.render(row[col?.dataIndex], row, index)
                    : row[col?.dataIndex]}
                </td>
              ))}
            </tr>
          </>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
