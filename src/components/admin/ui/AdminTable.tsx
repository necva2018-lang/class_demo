import type { ReactNode } from "react";

interface AdminTableProps {
  children: ReactNode;
  className?: string;
}

export function AdminTable({ children, className = "" }: AdminTableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-slate-200 bg-white ${className}`}
    >
      <table className="min-w-full divide-y divide-slate-200">
        {children}
      </table>
    </div>
  );
}

interface AdminTableHeadProps {
  children: ReactNode;
}

export function AdminTableHead({ children }: AdminTableHeadProps) {
  return (
    <thead className="bg-slate-50">
      <tr>{children}</tr>
    </thead>
  );
}

interface AdminTableHeaderCellProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableHeaderCell({
  children,
  className = "",
}: AdminTableHeaderCellProps) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

interface AdminTableBodyProps {
  children: ReactNode;
}

export function AdminTableBody({ children }: AdminTableBodyProps) {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>;
}

interface AdminTableRowProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableRow({ children, className = "" }: AdminTableRowProps) {
  return (
    <tr className={`hover:bg-slate-50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

interface AdminTableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export function AdminTableCell({
  children,
  className = "",
  colSpan,
}: AdminTableCellProps) {
  return (
    <td
      colSpan={colSpan}
      className={`whitespace-nowrap px-4 py-3 text-sm text-slate-700 ${className}`}
    >
      {children}
    </td>
  );
}
