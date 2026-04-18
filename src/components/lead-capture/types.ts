export interface LeadData {
  name: string;
  phone: string;
  user_type: string;
  self_subtype: string; // school | college | adult (only when user_type === "self")
  city: string;
  area: string;
  mode: string;
  class_level: string;
  board: string;
  board_other: string;
  course: string; // college course / degree
  specialization: string;
  exam: string;
  exam_category: string;
  prep_level: string;
  skill_type: string;
  skill_goal: string;
  hobby_type: string;
  hobby_goal: string;
  subjects: string[];
  goals: string[];
  goal_other: string;
  preferred_time: string;
  frequency: string;
  start_time: string;
}

export const INITIAL_LEAD_DATA: LeadData = {
  name: "",
  phone: "",
  user_type: "",
  self_subtype: "",
  city: "",
  area: "",
  mode: "",
  class_level: "",
  board: "",
  board_other: "",
  course: "",
  specialization: "",
  exam: "",
  exam_category: "",
  prep_level: "",
  skill_type: "",
  skill_goal: "",
  hobby_type: "",
  hobby_goal: "",
  subjects: [],
  goals: [],
  goal_other: "",
  preferred_time: "",
  frequency: "",
  start_time: "",
};

export interface StepProps {
  data: LeadData;
  onChange: (updates: Partial<LeadData>) => void;
}

export const USER_TYPES = [
  { value: "child", label: "My Child", subtitle: "School Student", emoji: "👨‍👩‍👧" },
  { value: "self", label: "Myself", subtitle: "School / College / Adult", emoji: "🎓" },
  { value: "exam", label: "Competitive Exams", subtitle: "JEE, NEET, UPSC...", emoji: "🎯" },
  { value: "skill", label: "Skill / Language", subtitle: "English, Coding...", emoji: "💡" },
  { value: "hobby", label: "Hobby / Extra", subtitle: "Music, Art, Chess...", emoji: "🎨" },
];

export const SELF_SUBTYPES = [
  { value: "school", label: "School Student", subtitle: "Class 5–12", emoji: "🏫" },
  { value: "college", label: "College Student", subtitle: "UG / PG", emoji: "🎓" },
  { value: "adult", label: "Adult Learner", subtitle: "Skill / Career", emoji: "💼" },
];

export const EXAM_CATEGORIES: Record<string, string[]> = {
  Engineering: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEEE"],
  Medical: ["NEET UG", "NEET PG", "AIIMS"],
  Commerce: ["CUET", "IPMAT", "CA Foundation", "CS Foundation"],
  Government: ["UPSC", "SSC", "Banking", "NDA/CDS"],
  "School Level": ["Olympiads", "NTSE"],
  International: ["SAT", "ACT", "GRE", "GMAT", "IELTS", "TOEFL"],
};

export const PREP_LEVELS = ["Beginner", "Ongoing Preparation", "Revision / Crash Course", "Doubt Solving"];

export const SKILL_OPTIONS = [
  "Spoken English",
  "Public Speaking",
  "Coding / Programming",
  "Foreign Languages",
  "Personality Development",
  "Interview Preparation",
  "Career Skills",
  "Other",
];

export const SKILL_GOALS = [
  "Learn from basics",
  "Improve fluency",
  "Career advancement",
  "Exam preparation (IELTS/TOEFL)",
  "Hobby learning",
  "Other",
];

export const HOBBY_OPTIONS = [
  "Chess",
  "Music",
  "Dance",
  "Art & Craft",
  "Drawing / Painting",
  "Yoga / Fitness",
  "Photography",
  "Other",
];

export const HOBBY_GOALS = [
  "Learn as beginner",
  "Improve skills",
  "Professional training",
  "Just for fun",
  "Other",
];

export const SUBJECT_OPTIONS = [
  "Mathematics", "Science", "Physics", "Chemistry", "Biology",
  "English", "Hindi", "Social Studies", "Accounts", "Economics",
  "Computer Science", "French", "German", "Spanish", "Other",
];

export const GOAL_OPTIONS = [
  "Improve Marks",
  "Exam Preparation",
  "Concept Clarity",
  "Homework Help",
  "Skill Development",
  "Personality Development",
  "Other",
];

// Classes for school students (My Child = full range, Myself+School = 5–12)
export const CLASS_OPTIONS_FULL = [
  "Nursery", "KG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6",
  "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
];

export const CLASS_OPTIONS_SELF_SCHOOL = [
  "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
];

export const BOARD_OPTIONS = ["CBSE", "ICSE", "IB", "State Board", "Other"];

// Suggestions for autocomplete (any other Indian city is also accepted via free-text validation).
export const CITY_OPTIONS = [
  "Bangalore", "Mumbai", "Delhi", "New Delhi", "Gurgaon", "Noida", "Ghaziabad", "Faridabad",
  "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Chandigarh", "Indore", "Bhopal", "Nagpur", "Surat", "Vadodara", "Kanpur",
  "Patna", "Kochi", "Thiruvananthapuram", "Coimbatore", "Visakhapatnam",
  "Bhubaneswar", "Guwahati", "Dehradun", "Mysore", "Mangalore",
];

/**
 * Permissive location validator used by the lead-capture flow.
 * Accepts:
 *  - Any 6-digit Indian pincode
 *  - Any city/locality name with at least 3 letters
 */
export const isValidCityOrPincode = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^\d+$/.test(trimmed)) return /^\d{6}$/.test(trimmed);
  // At least 3 letters; allows letters, spaces, hyphens, apostrophes, dots
  return /^[A-Za-z][A-Za-z\s'.-]{2,}$/.test(trimmed);
};
