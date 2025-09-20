export interface CourseSession {
  id: string;
  courseCode: string;
  courseName: string;
  professor: string;
  location: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  date: Date; // Specific date for this session
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  color: string;
  type: "lecture" | "seminar" | "lab";
}

export interface CalendarView {
  type: "week" | "month";
  currentDate: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  courseSession: CourseSession;
}
