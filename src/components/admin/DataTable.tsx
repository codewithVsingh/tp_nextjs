import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface ColumnDef {
  key: string;
  header: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: ColumnDef[];
  loading: boolean;
  page: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onRowClick?: (row: any) => void;
}

export const DataTable = ({ data, columns, loading, page, totalRecords, pageSize, onPageChange, onRowClick }: DataTableProps) => {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white/50 h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50/50 rounded-xl border border-dashed m-6">
        <p className="text-muted-foreground text-sm">No records detected matching parameters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto bg-white min-h-[450px]">
        <table className="w-full text-[13px] text-left border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-white border-b shadow-[0_1px_0_0_#e5e7eb]">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3.5 font-bold text-gray-400 uppercase text-[10px] tracking-wider whitespace-nowrap bg-white">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => {
              const today = new Date();
              today.setHours(0,0,0,0);
              const nextDate = row.next_follow_up ? new Date(row.next_follow_up) : null;
              if(nextDate) nextDate.setHours(0,0,0,0);
              
              const isToday = nextDate && nextDate.getTime() === today.getTime();
              const isOverdue = nextDate && nextDate.getTime() < today.getTime();

              let rowBg = 'bg-white hover:bg-gray-50/80 hover:shadow-[0_4px_12px_-5px_rgb(0,0,0,0.05)]';
              if (isOverdue) rowBg = 'bg-red-50/30 hover:bg-red-50/50 border-l-[3px] border-l-red-500';
              else if (isToday) rowBg = 'bg-amber-50/30 hover:bg-amber-50/50 border-l-[3px] border-l-amber-500';
              else if (row.is_new) rowBg = 'bg-blue-50/30 hover:bg-blue-50/50 border-l-[3px] border-l-blue-500';

              return (
              <tr 
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={`transition-all duration-150 ${onRowClick ? 'cursor-pointer' : ''} ${rowBg}`}
              >
                {columns.map((col, cIdx) => (
                  <td key={col.key} className="px-5 py-3 border-b border-gray-50">
                    {cIdx === 0 && row.is_new && !isToday && !isOverdue && (
                      <span className="inline-block mr-2 px-1.5 py-0.5 rounded text-[8px] font-black bg-blue-500 text-white uppercase tracking-widest">New</span>
                    )}
                    {cIdx === 0 && isOverdue && (
                      <span className="inline-block mr-2 px-1.5 py-0.5 rounded text-[8px] font-black bg-red-600 text-white uppercase tracking-widest">Late</span>
                    )}
                    {cIdx === 0 && isToday && (
                      <span className="inline-block mr-2 px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500 text-white uppercase tracking-widest">Now</span>
                    )}
                    {col.render 
                      ? col.render(row[col.key], row) 
                      : (row[col.key] && col.key === "created_at" 
                          ? (
                            <span className="font-medium text-gray-700 whitespace-nowrap">
                              {format(parseISO(row[col.key]), "dd MMM, yy")}
                            </span>
                          )
                          : row[col.key] || '-')}
                  </td>
                ))}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 shrink-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalRecords)} <span className="mx-1">/</span> {totalRecords} Records
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onPageChange(page - 1)} 
            disabled={page <= 1}
            className="h-8 text-[11px] font-bold"
          >
            Prev
          </Button>
          <div className="text-[11px] font-bold px-3 py-1 bg-gray-50 rounded-md border text-gray-700">
            {page} of {totalPages}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onPageChange(page + 1)} 
            disabled={page >= totalPages}
            className="h-8 text-[11px] font-bold"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

