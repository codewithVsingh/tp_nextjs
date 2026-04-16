export interface LeadData {
  name: string;
  phone: string;
  user_type: string;
  city: string;
  area: string;
  mode: string;
  class_level: string;
  board: string;
  exam: string;
  exam_category: string;
  prep_level: string;
  skill_type: string;
  hobby_type: string;
  subjects: string[];
  goals: string[];
  preferred_time: string;
  frequency: string;
  start_time: string;
}

export const INITIAL_LEAD_DATA: LeadData = {
  name: "",
  phone: "",
  user_type: "",
  city: "",
  area: "",
  mode: "",
  class_level: "",
  board: "",
  exam: "",
  exam_category: "",
  prep_level: "",
  skill_type: "",
  hobby_type: "",
  subjects: [],
  goals: [],
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
  { value: "self", label: "Myself", subtitle: "School / College", emoji: "🎓" },
  { value: "exam", label: "Competitive Exams", subtitle: "JEE, NEET, UPSC...", emoji: "🎯" },
  { value: "skill", label: "Skill / Language", subtitle: "English, Coding...", emoji: "💡" },
  { value: "hobby", label: "Hobby / Extra", subtitle: "Music, Art, Chess...", emoji: "🎨" },
];

export const EXAM_CATEGORIES: Record<string, string[]> = {
  "Engineering": ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEEE"],
  "Medical": ["NEET UG", "NEET PG", "AIIMS"],
  "Commerce": ["CUET", "IPMAT", "CA Foundation", "CS Foundation"],
  "Government": ["UPSC", "SSC", "Banking", "NDA/CDS"],
  "School Level": ["Olympiads", "NTSE"],
  "International": ["SAT", "ACT", "GRE", "GMAT", "IELTS", "TOEFL"],
};

export const PREP_LEVELS = ["Beginner", "Ongoing Preparation", "Revision / Crash Course", "Doubt Solving"];

export const SKILL_OPTIONS = [
  "Spoken English", "Coding / Programming", "Foreign Languages",
  "Personality Development", "Public Speaking",
];

export const HOBBY_OPTIONS = ["Chess", "Music", "Dance", "Art & Craft"];

export const SUBJECT_OPTIONS = [
  "Mathematics", "Science", "Physics", "Chemistry", "Biology",
  "English", "Hindi", "Social Studies", "Accounts", "Economics",
  "Computer Science", "French", "German", "Spanish",
];

export const GOAL_OPTIONS = [
  "Improve Marks", "Exam Preparation", "Concept Clarity",
  "Homework Help", "Skill Development", "Personality Development",
];

export const CLASS_OPTIONS = [
  "Nursery", "KG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6",
  "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
];

export const BOARD_OPTIONS = ["CBSE", "ICSE", "IB", "State Board"];
