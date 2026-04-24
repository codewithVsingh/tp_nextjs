import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, CalendarIcon } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
}

export const ExportModal = ({ isOpen, onClose, activeTab }: Props) => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date()
  });

  const handleExport = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select a valid date range to export.");
      return;
    }
    
    setLoading(true);
    try {
      const fromISO = startOfDay(dateRange.from).toISOString();
      const toISO = endOfDay(dateRange.to).toISOString();

      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .gte("created_at", fromISO)
        .lte("created_at", toISO)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error("No records found in this date range.");
        setLoading(false);
        return;
      }

      // Convert to CSV
      const keys = Object.keys(data[0]);
      const csv = [
        keys.join(','),
        ...data.map(row => keys.map(k => `"${String(row[k] || '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Trigger standard download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const safeTabName = activeTab.replace(/_/g, '-').toLowerCase();
      link.download = `tp_${safeTabName}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
      
      toast.success(`Exported ${data.length} records successfully.`);
      onClose();
    } catch (err: any) {
      toast.error("Export failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data to CSV</DialogTitle>
          <DialogDescription>
            Download records for {activeTab.replace('_', ' ')}. Note that large limits might take time.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Select Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, yyyy")} - {format(dateRange.to, "LLL dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

