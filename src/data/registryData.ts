export interface ComplaintRecord {
  id: string;
  tutorName: string;
  mobile: string;
  whatsapp: string;
  aadhaar?: string;
  location: { area: string; city: string; state: string };
  fraudType: FraudType;
  issueSummary: string;
  reportedDate: string;
  status: "verified" | "under_review" | "rejected";
  repeatOffender: boolean;
  reportCount: number;
  // Agency details — never shown publicly
  agency: { name: string; contact: string; phone: string; email: string };
}

export type FraudType =
  | "direct_parent_deal"
  | "payment_fraud"
  | "no_show"
  | "commission_bypass"
  | "other";

export const fraudTypeLabels: Record<FraudType, string> = {
  direct_parent_deal: "Direct Parent Deal",
  payment_fraud: "Payment Fraud",
  no_show: "No-Show / Ghosting",
  commission_bypass: "Commission Bypass",
  other: "Other",
};

export const statesAndCities: Record<string, string[]> = {
  Delhi: ["New Delhi", "South Delhi", "North Delhi", "West Delhi", "East Delhi", "Dwarka", "Rohini", "Pitampura"],
  "Uttar Pradesh": ["Noida", "Ghaziabad", "Greater Noida", "Lucknow", "Agra"],
  Haryana: ["Gurugram", "Faridabad", "Karnal", "Panipat"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
};

// Masking utilities
export function maskMobile(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "XXXXXX****";
  return "XXXXXX" + digits.slice(-4);
}

export function maskAadhaar(aadhaar: string): string {
  const digits = aadhaar.replace(/\D/g, "");
  if (digits.length < 4) return "XXXXXXXX****";
  return "XXXXXXXX" + digits.slice(-4);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "****@****";
  const visible = local.slice(0, Math.min(4, local.length));
  return visible + "****@" + domain;
}

// Mock data
export const mockRecords: ComplaintRecord[] = [
  {
    id: "1",
    tutorName: "Rahul Sharma",
    mobile: "9876543210",
    whatsapp: "9876543210",
    aadhaar: "123456781234",
    location: { area: "Sector 14", city: "Rohini", state: "Delhi" },
    fraudType: "direct_parent_deal",
    issueSummary: "Tutor bypassed the agency and directly approached the parent to continue classes without agency involvement, violating contractual terms.",
    reportedDate: "2026-03-15",
    status: "verified",
    repeatOffender: true,
    reportCount: 3,
    agency: { name: "ABC Institute", contact: "Mr. Gupta", phone: "9111111111", email: "abc@inst.com" },
  },
  {
    id: "2",
    tutorName: "Priya Verma",
    mobile: "8587012345",
    whatsapp: "8587012345",
    location: { area: "Dwarka Sec 12", city: "Dwarka", state: "Delhi" },
    fraudType: "no_show",
    issueSummary: "Confirmed 4 demo classes but did not show up for any. Stopped responding to calls and messages after first payment.",
    reportedDate: "2026-02-28",
    status: "verified",
    repeatOffender: false,
    reportCount: 1,
    agency: { name: "LearnFirst", contact: "Ms. Kapoor", phone: "9222222222", email: "learn@first.com" },
  },
  {
    id: "3",
    tutorName: "Amit Tiwari",
    mobile: "7011234567",
    whatsapp: "7011234567",
    aadhaar: "998877661234",
    location: { area: "Pitampura", city: "North Delhi", state: "Delhi" },
    fraudType: "payment_fraud",
    issueSummary: "Collected advance fees from multiple parents claiming to be from the institute. Total fraud amount approximately ₹45,000.",
    reportedDate: "2026-01-10",
    status: "under_review",
    repeatOffender: false,
    reportCount: 1,
    agency: { name: "EduBridge", contact: "Mr. Rao", phone: "9333333333", email: "edu@bridge.com" },
  },
  {
    id: "4",
    tutorName: "Sneha Agarwal",
    mobile: "9012345678",
    whatsapp: "9012345678",
    location: { area: "Lajpat Nagar", city: "South Delhi", state: "Delhi" },
    fraudType: "commission_bypass",
    issueSummary: "After being assigned through agency, negotiated directly with 3 families to reduce fee and cut out agency commission entirely.",
    reportedDate: "2026-03-01",
    status: "verified",
    repeatOffender: true,
    reportCount: 2,
    agency: { name: "TutorHub", contact: "Mr. Singh", phone: "9444444444", email: "tutor@hub.com" },
  },
  {
    id: "5",
    tutorName: "Vikram Chauhan",
    mobile: "8800112233",
    whatsapp: "8800112233",
    aadhaar: "556677889012",
    location: { area: "Sector 62", city: "Noida", state: "Uttar Pradesh" },
    fraudType: "direct_parent_deal",
    issueSummary: "Took 2 batches from agency and then started own coaching from home with the same students. Refused to return student list.",
    reportedDate: "2025-12-20",
    status: "verified",
    repeatOffender: false,
    reportCount: 1,
    agency: { name: "SmartLearn", contact: "Ms. Jain", phone: "9555555555", email: "smart@learn.com" },
  },
  {
    id: "6",
    tutorName: "Deepak Kumar",
    mobile: "9998887776",
    whatsapp: "9998887776",
    location: { area: "Gurugram Sec 56", city: "Gurugram", state: "Haryana" },
    fraudType: "no_show",
    issueSummary: "Missed 6 consecutive classes without informing. Parents complained to agency. Tutor blocked agency number afterward.",
    reportedDate: "2026-04-01",
    status: "under_review",
    repeatOffender: false,
    reportCount: 1,
    agency: { name: "EduFirst", contact: "Mr. Mehta", phone: "9666666666", email: "edu@first.com" },
  },
  {
    id: "7",
    tutorName: "Kavita Mishra",
    mobile: "7777888899",
    whatsapp: "7777888899",
    aadhaar: "112233445566",
    location: { area: "Mayur Vihar", city: "East Delhi", state: "Delhi" },
    fraudType: "payment_fraud",
    issueSummary: "Collected ₹12,000 advance from parent for study material that was never delivered. Gave fake receipts.",
    reportedDate: "2026-02-14",
    status: "verified",
    repeatOffender: true,
    reportCount: 4,
    agency: { name: "TopGrade", contact: "Ms. Sharma", phone: "9777777777", email: "top@grade.com" },
  },
  {
    id: "8",
    tutorName: "Rajan Patel",
    mobile: "6666555544",
    whatsapp: "6666555544",
    location: { area: "Vaishali", city: "Ghaziabad", state: "Uttar Pradesh" },
    fraudType: "other",
    issueSummary: "Provided fake qualification certificates during onboarding. Was not actually a B.Ed holder as claimed on profile.",
    reportedDate: "2026-03-20",
    status: "verified",
    repeatOffender: false,
    reportCount: 1,
    agency: { name: "BrightFuture", contact: "Mr. Das", phone: "9888888888", email: "bright@future.com" },
  },
];

// Search & filter
export function searchRecords(
  records: ComplaintRecord[],
  query: string,
  filters: { state?: string; city?: string; fraudType?: FraudType; status?: string }
): ComplaintRecord[] {
  let results = records.filter((r) => r.status !== "rejected");

  if (filters.status) {
    results = results.filter((r) => r.status === filters.status);
  }
  if (filters.fraudType) {
    results = results.filter((r) => r.fraudType === filters.fraudType);
  }
  if (filters.state) {
    results = results.filter((r) => r.location.state === filters.state);
  }
  if (filters.city) {
    results = results.filter((r) => r.location.city === filters.city);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter((r) => {
      const last4Mobile = r.mobile.slice(-4);
      const last4Whatsapp = r.whatsapp.slice(-4);
      return (
        r.tutorName.toLowerCase().includes(q) ||
        last4Mobile.includes(q) ||
        last4Whatsapp.includes(q) ||
        r.location.city.toLowerCase().includes(q) ||
        r.location.area.toLowerCase().includes(q) ||
        r.location.state.toLowerCase().includes(q) ||
        r.issueSummary.toLowerCase().includes(q) ||
        fraudTypeLabels[r.fraudType].toLowerCase().includes(q)
      );
    });
  }

  return results;
}

