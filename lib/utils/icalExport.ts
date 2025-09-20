import { format } from "date-fns";
import { CourseSession } from "@/lib/types/calendar";

// Generate iCal (.ics) content from course sessions
export function generateICalContent(sessions: CourseSession[]): string {
  const now = new Date();
  const timestamp = format(now, "yyyyMMdd'T'HHmmss'Z'");

  // iCal header
  let icalContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Keio Course Planner//Keio Distance Learning//JA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:慶應通信 コース予定",
    "X-WR-CALDESC:慶應義塾大学通信教育課程の選択科目スケジュール",
    "X-WR-TIMEZONE:Asia/Tokyo",
    "",
  ].join("\r\n");

  // Add each session as an event
  sessions.forEach((session) => {
    const startDateTime = formatDateTimeForICal(
      session.date,
      session.startTime
    );
    const endDateTime = formatDateTimeForICal(session.date, session.endTime);
    const uid = `${session.id}@keio-course-planner.local`;

    icalContent += [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;TZID=Asia/Tokyo:${startDateTime}`,
      `DTEND;TZID=Asia/Tokyo:${endDateTime}`,
      `SUMMARY:${session.courseName}`,
      `DESCRIPTION:コード: ${session.courseCode}\\n講師: ${session.professor}\\n場所: ${session.location}`,
      `LOCATION:${session.location}`,
      `CATEGORIES:${getCategoryFromCourseCode(session.courseCode)}`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT",
      "",
    ].join("\r\n");
  });

  // iCal footer
  icalContent += "END:VCALENDAR\r\n";

  return icalContent;
}

// Format date and time for iCal format (YYYYMMDDTHHMMSS)
function formatDateTimeForICal(date: Date, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const dateTime = new Date(date);
  dateTime.setHours(hours, minutes, 0, 0);

  return format(dateTime, "yyyyMMdd'T'HHmmss");
}

// Get category from course code (first 1-2 digits indicate department)
function getCategoryFromCourseCode(courseCode: string): string {
  const firstDigit = courseCode.charAt(0);

  switch (firstDigit) {
    case "1":
      return "総合教育科目";
    case "2":
      return "外国語科目";
    case "5":
      return "文学部";
    case "6":
      return "経済学部";
    case "7":
      return "法学部";
    default:
      return "専門科目";
  }
}

// Download iCal file
export function downloadICalFile(
  sessions: CourseSession[],
  filename?: string
): void {
  const icalContent = generateICalContent(sessions);
  const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download =
    filename || `keio-courses-${format(new Date(), "yyyy-MM-dd")}.ics`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
}

// Create data URL for iCal content (for sharing/subscribing)
export function createICalDataURL(sessions: CourseSession[]): string {
  const icalContent = generateICalContent(sessions);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icalContent)}`;
}

// Generate summary statistics for export
export function getExportSummary(sessions: CourseSession[]) {
  const totalSessions = sessions.length;
  const uniqueCourses = new Set(sessions.map((s) => s.courseCode)).size;
  const totalCredits = sessions.reduce((sum, session) => {
    // Estimate credits: assume 2 credits per unique course
    return sum;
  }, 0);

  const dateRange =
    sessions.length > 0
      ? {
          start: new Date(Math.min(...sessions.map((s) => s.date.getTime()))),
          end: new Date(Math.max(...sessions.map((s) => s.date.getTime()))),
        }
      : null;

  return {
    totalSessions,
    uniqueCourses,
    totalCredits: uniqueCourses * 2, // Assume 2 credits per course
    dateRange,
  };
}
