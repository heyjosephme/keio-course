import { addDays, addWeeks } from "date-fns";
import { CourseSession } from "@/lib/types/calendar";

// Evening course scheduling logic for 2025
export function generateEveningCourseSessions(
  courseCode: string,
  courseName: string,
  professor: string,
  dayOfWeek: string,
  color: string
): CourseSession[] {
  const sessions: CourseSession[] = [];

  // Map day names to numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMap: { [key: string]: number } = {
    'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5
  };

  const targetDay = dayMap[dayOfWeek.toLowerCase()];
  if (!targetDay) return sessions;

  // Find first occurrence of the target day in October 2025
  let currentDate = new Date(2025, 9, 1); // October 1, 2025
  while (currentDate.getDay() !== targetDay) {
    currentDate = addDays(currentDate, 1);
  }

  // Generate 12 weekly sessions, skipping invalid dates
  let sessionCount = 0;
  let weekCount = 0;

  while (sessionCount < 12) {
    const sessionDate = addWeeks(currentDate, weekCount);

    // If this date is valid, add the session
    if (!isDateInvalid(sessionDate)) {
      sessions.push({
        id: `${courseCode}-${sessionCount + 1}`,
        courseCode,
        courseName,
        professor,
        location: "三田キャンパス",
        startTime: "18:20",
        endTime: "20:05",
        date: sessionDate,
        dayOfWeek: targetDay,
        color,
        type: 'lecture'
      });
      sessionCount++;
    }

    weekCount++;

    // Safety break to prevent infinite loop
    if (weekCount > 25) break;
  }

  return sessions;
}

// Check if a date is invalid for evening sessions
function isDateInvalid(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // 三田祭期間: Nov 19-24, 2025 (skip this entire week)
  const mitasaiStart = new Date(2025, 10, 19); // Nov 19
  const mitasaiEnd = new Date(2025, 10, 24);   // Nov 24
  if (date >= mitasaiStart && date <= mitasaiEnd) {
    return true;
  }

  // New Year holidays: Dec 29, 2025 onwards until Jan 5, 2026
  if ((year === 2025 && month === 11 && day >= 29) ||
      (year === 2026 && month === 0 && day <= 5)) {
    return true;
  }

  return false;
}

// Weekend course scheduling logic for 2025
export function generateWeekendCourseSessions(
  courseCode: string,
  courseName: string,
  professor: string,
  color: string
): CourseSession[] {
  const sessions: CourseSession[] = [];

  // First weekend starts Oct 11, 2025 (Saturday)
  const firstSaturday = new Date(2025, 9, 11); // Oct 11, 2025

  // Generate 3 consecutive weekends
  for (let weekIndex = 0; weekIndex < 3; weekIndex++) {
    const saturday = addWeeks(firstSaturday, weekIndex);
    const sunday = addDays(saturday, 1);

    // Saturday afternoon session
    sessions.push({
      id: `${courseCode}-sat-${weekIndex + 1}`,
      courseCode,
      courseName,
      professor,
      location: "三田キャンパス",
      startTime: "13:30",
      endTime: "17:15",
      date: saturday,
      dayOfWeek: 6, // Saturday
      color,
      type: 'lecture'
    });

    // Sunday morning session
    sessions.push({
      id: `${courseCode}-sun-${weekIndex + 1}`,
      courseCode,
      courseName,
      professor,
      location: "三田キャンパス",
      startTime: "09:00",
      endTime: "12:45",
      date: sunday,
      dayOfWeek: 0, // Sunday
      color,
      type: 'lecture'
    });
  }

  return sessions;
}

// Get faculty color mapping
export function getFacultyColor(faculty: string): string {
  const colorMap: { [key: string]: string } = {
    '総合': '#3B82F6',     // Blue
    '文学部': '#10B981',   // Green
    '経済学部': '#8B5CF6', // Purple
    '法学部': '#F59E0B',   // Amber
    '教職': '#EF4444',     // Red
  };
  return colorMap[faculty] || '#6B7280'; // Default gray
}