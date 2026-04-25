"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";;
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Phone, MessageSquare, Shield, AlertTriangle, Calendar, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import {
  mockRecords,
  searchRecords,
  maskMobile,
  maskAadhaar,
  fraudTypeLabels,
  statesAndCities,
  type FraudType,
  type ComplaintRecord,
} from "@/data/registryData";

const ITEMS_PER_PAGE = 8;

const TutorRegistry = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [fraudType, setFraudType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback((val: string) => {
    setQuery(val);
    if (debounceRef[0]) clearTimeout(debounceRef[0]);
    debounceRef[0] = setTimeout(() => {
      setDebouncedQuery(val);
      setPage(1);
    }, 250);
  }, [debounceRef]);

  const cities = state ? statesAndCities[state] || [] : [];

  const filtered = useMemo(
    () =>
      searchRecords(mockRecords, debouncedQuery, {
        state: state || undefined,
        city: city || undefined,
        fraudType: (fraudType as FraudType) || undefined,
        status: status || undefined,
      }),
    [debouncedQuery, state, city, fraudType, status]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setState("");
    setCity("");
    setFraudType("");
    setStatus("");
    setQuery("");
    setDebouncedQuery("");
    setPage(1);
  };

  const hasFilters = !!(state || city || fraudType || status || query);

  return (
    <>
      <SEOHead
        title="Tutor Verification & Complaint Registry | Tutors Parliament"
        description="Search and report verified cases of tutor misconduct across agencies. Privacy-safe, verified complaint registry."
      />
      
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 pt-28 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                <Shield className="w-3 h-3 mr-1" /> Verified Registry
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Tutor Verification & Complaint Registry
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Search and report verified cases of tutor misconduct across agencies. All data is privacy-safe and verified.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone last digits, location, or issue..."
                  className="pl-12 h-14 text-base rounded-xl shadow-lg border-border/50 bg-card"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sticky Filters */}
        <section className="sticky top-16 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Select value={state} onValueChange={(v) => { setState(v); setCity(""); setPage(1); }}>
              <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                {Object.keys(statesAndCities).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={city} onValueChange={(v) => { setCity(v); setPage(1); }} disabled={!state}>
              <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="City" /></SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={fraudType} onValueChange={(v) => { setFraudType(v); setPage(1); }}>
              <SelectTrigger className="w-[170px] h-9 text-sm"><SelectValue placeholder="Fraud Type" /></SelectTrigger>
              <SelectContent>
                {Object.entries(fraudTypeLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                <X className="w-3 h-3 mr-1" /> Reset
              </Button>
            )}
            <div className="ml-auto">
              <Button asChild variant="cta" size="sm">
                <Link href="/report-tutor">Report a Tutor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</p>

          {paginated.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              <AnimatePresence mode="popLayout">
                {paginated.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>
      </main>
      
    </>
  );
};

function RecordCard({ record }: { record: ComplaintRecord }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {record.tutorName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{record.tutorName}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {record.location.area}, {record.location.city}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant={record.status === "verified" ? "default" : "secondary"}
            className={record.status === "verified" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"}
          >
            {record.status === "verified" ? "Verified" : "Under Review"}
          </Badge>
          {record.repeatOffender && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Repeat Offender</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm mb-3">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Phone className="w-3 h-3" /> {maskMobile(record.mobile)}
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5">
          <MessageSquare className="w-3 h-3" /> {maskMobile(record.whatsapp)}
        </span>
        {record.aadhaar && (
          <span className="text-muted-foreground col-span-2 flex items-center gap-1.5">
            🆔 {maskAadhaar(record.aadhaar)}
          </span>
        )}
      </div>

      <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
          <span className="text-xs font-medium text-destructive">{fraudTypeLabels[record.fraudType]}</span>
        </div>
        <p className="text-sm text-foreground/80 line-clamp-2">{record.issueSummary}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Verified Institute</span>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(record.reportedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
      {record.reportCount > 1 && (
        <p className="text-xs text-destructive/70 mt-2">⚠️ {record.reportCount} reports filed</p>
      )}
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No records found</h3>
      <p className="text-muted-foreground">Try different filters or keywords.</p>
    </div>
  );
}

export default TutorRegistry;

