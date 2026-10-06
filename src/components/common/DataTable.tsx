import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, SearchX, Database } from 'lucide-react';
import type { TableColumn } from '../../types';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  defaultPageSize?: number;
  className?: string;
  emptyMessage?: string;
  // Heavy Data Capabilities (Server-side)
  serverSide?: boolean;
  totalRecords?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (key: keyof T, direction: 'asc' | 'desc') => void;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  loading = false,
  onRowClick,
  defaultPageSize = 20,
  className = '',
  emptyMessage = 'No records found',
  serverSide = false,
  totalRecords,
  currentPage: externalCurrentPage,
  onPageChange,
  onSortChange,
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  const currentPage = serverSide && externalCurrentPage !== undefined ? externalCurrentPage : internalPage;
  const actualTotalRecords = serverSide && totalRecords !== undefined ? totalRecords : data.length;
  const totalPages = Math.ceil(actualTotalRecords / defaultPageSize);

  const sortedData = React.useMemo(() => {
    if (serverSide) return data; // Backend handles sorting
    const sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig, serverSide]);

  const paginatedData = React.useMemo(() => {
    if (serverSide) return sortedData; // Backend handles pagination
    return sortedData.slice(
      (currentPage - 1) * defaultPageSize,
      currentPage * defaultPageSize
    );
  }, [sortedData, currentPage, defaultPageSize, serverSide]);

  const handlePageChange = (newPage: number) => {
    if (serverSide && onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    if (serverSide && onSortChange) {
      onSortChange(key, direction);
    } else {
      setInternalPage(1);
    }
  };

  // Loading skeleton
  if (loading && data.length === 0) {
    return (
      <div className={`rounded-xl border border-[var(--bg-border)] overflow-hidden ${className}`}>
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((_, i) => (
                <th key={i} className="text-left px-4 py-3 bg-[var(--bg-elevated)]">
                  <div className="h-3 w-20 bg-[var(--bg-border)] rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[var(--bg-border)]">
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3.5">
                    <div
                      className="h-3.5 bg-[var(--bg-border)] rounded animate-pulse"
                      style={{ width: `${50 + Math.random() * 40}%`, animationDelay: `${rowIndex * 80 + colIndex * 40}ms` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (!loading && data.length === 0) {
    return (
      <div className={`rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-16 flex flex-col items-center justify-center text-[var(--text-tertiary)] ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center mb-5 border border-[var(--bg-border)]">
          <SearchX className="w-7 h-7 opacity-50" />
        </div>
        <p className="font-semibold text-lg text-[var(--text-secondary)]">{emptyMessage}</p>
        <p className="text-sm mt-1.5 text-[var(--text-tertiary)]">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className={`flex-grow overflow-auto rounded-t-xl border border-[var(--bg-border)] ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <table className="w-full border-collapse text-left whitespace-nowrap">
          <thead className="sticky top-0 z-[var(--z-sticky)]">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`text-[10px] font-bold uppercase tracking-wider px-4 py-3 text-left bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-b border-[var(--bg-border)] select-none ${
                    col.sortable !== false ? 'cursor-pointer hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors' : ''
                  }`}
                  onClick={() => col.sortable !== false && requestSort(col.key)}
                >
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable !== false && sortConfig?.key === col.key && (
                        <span className="text-[var(--accent-blue-lt)]">
                          {sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                    {col.searchable && (
                      <div className="mt-1" onClick={e => e.stopPropagation()}>
                        <input 
                          type="text" 
                          placeholder="Search" 
                          className="w-full bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded px-2 py-1 text-xs text-[var(--text-primary)] font-normal normal-case focus:outline-none focus:border-[var(--accent-blue)]"
                          onChange={(e) => col.onSearch?.(e.target.value)}
                        />
                      </div>
                    )}
                    {col.filter && (
                      <div onClick={(event) => event.stopPropagation()}>
                        {col.filter}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex} // Ensures robust mapping with heavy data keys
                className={`border-b border-[var(--bg-border)] transition-colors duration-100 hover:bg-[var(--bg-hover)] ${
                  onRowClick ? 'cursor-pointer active:bg-[var(--bg-active)]' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm text-[var(--text-primary)]">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-elevated)] border border-t-0 border-[var(--bg-border)] rounded-b-xl">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Database className="w-3.5 h-3.5" />
            <span>
              <span className="font-semibold text-[var(--text-primary)]">{((currentPage - 1) * defaultPageSize) + 1}–{Math.min(currentPage * defaultPageSize, actualTotalRecords)}</span>
              {' '}of{' '}
              <span className="font-semibold text-[var(--text-primary)]">{actualTotalRecords}</span>
              {' '}records
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-[var(--bg-surface)] rounded-lg border border-[var(--bg-border)] tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
