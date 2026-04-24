import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export const TPDataTable = ({ 
  data, columns, loading, page, totalRecords, pageSize, 
  onPageChange, onRowClick, selectedIds = [], onSelectionChange 
}: DataTableProps) => {
  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectionChange) return;
    const next = selectedIds.includes(id) 
      ? selectedIds.filter(x => x !== id) 
      : [...selectedIds, id];
    onSelectionChange(next);
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (selectedIds.length === data.length) onSelectionChange([]);
    else onSelectionChange(data.map(x => x.id));
  };
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
              {onSelectionChange && (
                <th className="px-5 py-3.5 w-10 bg-white">
                  <input 
                    type="checkbox" 
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={toggleAll}
                    className="accent-indigo-600 rounded"
                  />
                </th>
              )}
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
              if (selectedIds.includes(row.id)) rowBg = 'bg-indigo-50/50 hover:bg-indigo-50/80 border-l-[3px] border-l-indigo-600';
              else if (isOverdue) rowBg = 'bg-red-50/30 hover:bg-red-50/50 border-l-[3px] border-l-red-500';
              else if (isToday) rowBg = 'bg-amber-50/30 hover:bg-amber-50/50 border-l-[3px] border-l-amber-500';
              else if (row.is_new) rowBg = 'bg-blue-50/30 hover:bg-blue-50/50 border-l-[3px] border-l-blue-500';

              return (
              <tr 
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={`transition-all duration-150 ${onRowClick ? 'cursor-pointer' : ''} ${rowBg}`}
              >
                {onSelectionChange && (
                  <td className="px-5 py-3 border-b border-gray-50 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => toggleRow(row.id, e as any)}
                      className="accent-indigo-600 rounded"
                    />
                  </td>
                )}
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
          {totalRecords > 0 ? ((page - 1) * pageSize) + 1 : 0}-{Math.min(page * pageSize, totalRecords)} <span className="mx-1">/</span> {totalRecords} Records
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

          <Select 
            value={page.toString()} 
            onValueChange={(val) => onPageChange(parseInt(val))}
          >
            <SelectTrigger className="h-8 w-[90px] text-[11px] font-bold bg-gray-50 border-gray-200">
              <SelectValue placeholder={`Page ${page}`} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()} className="text-[11px]">
                  {i + 1} of {totalPages}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

