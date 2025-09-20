import { Course } from "@/lib/data/courseLoader";

// Test courses for quick development testing
export const testCourses: Course[] = [
  {
    code: "62502",
    name: "経済原論（マクロ経済学）",
    credits: 2,
    instructor: "穂刈　享",
    faculty: "経済学部",
    day_of_week: "monday"
  },
  {
    code: "72540",
    name: "日本政治論",
    credits: 2,
    instructor: "松浦　淳介/姜　兌ゆん",
    faculty: "法学部",
    day_of_week: "wednesday"
  },
  {
    code: "52545",
    name: "国文学古典研究",
    credits: 2,
    instructor: "合山　林太郎",
    faculty: "文学部",
    day_of_week: "thursday"
  },
  {
    code: "52561",
    name: "哲学（専門）",
    credits: 2,
    instructor: "森　正樹/鈴木　優花",
    faculty: "文学部",
    schedule: "土日"
  },
  {
    code: "62515",
    name: "経済学史",
    credits: 2,
    instructor: "穂刈　享",
    faculty: "経済学部",
    schedule: "土日"
  }
];

// Helper function to get test courses from localStorage or return defaults
export function getTestSelectedCourses(): Course[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('selectedCourses');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored courses, using test data');
    }
  }

  return testCourses;
}

// Helper function to set test courses in localStorage
export function setTestSelectedCourses(courses: Course[] = testCourses): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('selectedCourses', JSON.stringify(courses));
  console.log(`Set ${courses.length} test courses in localStorage`);
}

// Enable test mode - adds test courses to localStorage
export function enableTestMode(): void {
  setTestSelectedCourses();
  console.log('Test mode enabled! Reload calendar to see test courses.');
}

// Clear test data
export function clearTestData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('selectedCourses');
  console.log('Test data cleared');
}

// Development helper - expose functions to window in dev mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testMode = {
    enable: enableTestMode,
    clear: clearTestData,
    set: setTestSelectedCourses,
    courses: testCourses
  };

  console.log('🧪 Test mode helpers available:');
  console.log('  - window.testMode.enable() - Add test courses');
  console.log('  - window.testMode.clear() - Clear all courses');
  console.log('  - window.testMode.set(courses) - Set custom courses');
}