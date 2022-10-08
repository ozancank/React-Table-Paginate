import React, { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    axios
      .get(
        `https://jsonplaceholder.typicode.com/users/1/todos?_page=${
          pagination.pageIndex + 1
        }&_limit=${pagination.pageSize}`
      )
      .then((x) => {
        setData(x.data);
      });
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(
    () => [
      { header: "UserId", accessorKey: "userId" },
      { header: "Id", accessorKey: "id" },
      { header: "Title", accessorKey: "title" },
      { header: "Completed", accessorKey: "completed" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: data.length - 1,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id}>
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} style={{ border: "1px solid black" }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={columns.length}
              style={{ border: "1px solid red", textAlign: "center" }}
            >
              <button
                onClick={() => {
                  table.setPageIndex(0);
                }}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </button>{" "}
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>{" "}
              <span>
                <strong>
                  {`${
                    table.getState().pagination.pageIndex + 1
                  } / ${table.getPageCount()}`}
                </strong>
              </span>{" "}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>{" "}
              <button
                onClick={() => table.setPageIndex(table.getPageCount())}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      <pre>{JSON.stringify(pagination, null, 2)}</pre>
    </div>
  );
};

export default App;
