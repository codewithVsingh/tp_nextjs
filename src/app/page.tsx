import Index from "../views/Index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutors Parliament | Best Home Tutors & Online Tuition in Delhi NCR",
  description: "Find the best home tutors and online tuition in Delhi, Noida, Gurgaon & Ghaziabad. 2,500+ verified tutors for CBSE, ICSE, IB & competitive exams. Book a free demo class today!",
  keywords: "home tutor delhi, online tuition delhi, best home tutors ncr, cbse tutor delhi, math tutor delhi, science tutor delhi, home tuition near me",
};

export default function Page() {
  return <Index />;
}

export const revalidate = 86400;

